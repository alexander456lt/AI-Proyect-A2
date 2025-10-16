#!/usr/bin/env python3
"""
A2 Web Dashboard - Improved Version
===================================
Web dashboard for A2 assistant with clean structure, error handling,
and separation of concerns.
"""

import os
import sys
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from dataclasses import dataclass, asdict
from threading import Thread, Event
from queue import Queue, Empty
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
from werkzeug.exceptions import HTTPException

# Add core modules to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'core'))
from core.assistant import Assistant
from core.command_handler import CommandHandler

# --- Logging Configuration ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# --- Data Models ---
@dataclass
class CommandRequest:
    command: str
    text: str = ""
    timestamp: Optional[str] = None
    def __post_init__(self):
        self.timestamp = self.timestamp or datetime.now().isoformat()

@dataclass
class CommandResponse:
    id: str
    command: str
    text: str
    result: str
    status: str
    timestamp: str

@dataclass
class DashboardStats:
    total_commands: int
    successful_commands: int
    failed_commands: int
    uptime: str

# --- Dashboard Manager ---
class DashboardManager:
    def __init__(self):
        self.assistant = Assistant(name="A2-Web")
        self.command_handler = CommandHandler(self.assistant)
        self.stats = {
            'total_commands': 0,
            'successful_commands': 0,
            'failed_commands': 0,
            'start_time': datetime.now()
        }
        self.command_history = []
        self._setup_commands()

    def _setup_commands(self):
        try:
            commands = self.command_handler.get_available_commands()
            for keyword in commands:
                self.assistant.register_command(
                    keyword,
                    lambda text, kw=keyword: self.command_handler.execute(kw, text)
                )
        except Exception as e:
            logger.error(f"Error setting up commands: {e}")

    def execute_command(self, command: str, text: str = "") -> Dict[str, Any]:
        """Execute a command and return the result."""
        try:
            self.stats['total_commands'] += 1
            output = self.command_handler.execute(command, text)
            success = output is not False
            
            if success:
                self.stats['successful_commands'] += 1
            else:
                self.stats['failed_commands'] += 1
                
            # Add to history
            history_entry = {
                'id': f"cmd_{datetime.now().strftime('%Y%m%d%H%M%S')}",
                'command': command,
                'text': text,
                'result': 'success' if success else 'failed',
                'timestamp': datetime.now().isoformat(),
                'output': output if success else None
            }
            self.command_history.append(history_entry)
            
            # Keep only last 100 commands
            if len(self.command_history) > 100:
                self.command_history = self.command_history[-100:]
                
            return {
                'success': success,
                'output': output,
                'history_entry': history_entry
            }
            
        except Exception as e:
            logger.error(f"Command execution failed: {e}")
            self.stats['failed_commands'] += 1
            return {
                'success': False,
                'output': str(e),
                'error': str(e)
            }

    def get_stats(self) -> DashboardStats:
        uptime = datetime.now() - self.stats['start_time']
        return DashboardStats(
            total_commands=self.stats['total_commands'],
            successful_commands=self.stats['successful_commands'],
            failed_commands=self.stats['failed_commands'],
            uptime=str(uptime).split('.')[0]
        )

    def get_history(self) -> list:
        return self.command_history

    def clear_history(self):
        self.command_history.clear()
        return True

# --- Flask App & SocketIO ---
app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a2-secret-key-2024')
socketio = SocketIO(app, cors_allowed_origins="*", logger=False, engineio_logger=False)
dashboard_manager = DashboardManager()

# --- Error Handlers ---
@app.errorhandler(HTTPException)
def handle_exception(e):
    return jsonify({"error": e.name, "message": e.description, "status_code": e.code}), e.code

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found", "message": "The requested resource was not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({"error": "Internal server error", "message": "Something went wrong"}), 500

# --- Routes ---
@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        logger.error(f"Error serving index: {e}")
        return "<h1>A2 Dashboard</h1><p>Dashboard is running. Templates not found.</p>"

@app.route('/minijuegos')
def minijuegos():
    try:
        return render_template('minijuegos.html')
    except Exception as e:
        logger.error(f"Error serving minijuegos: {e}")
        return "<h1>Minijuegos</h1><p>Minijuegos section is loading...</p>"

@app.route('/games/<path:filename>')
def serve_games(filename):
    try:
        games_dir = os.path.join(os.path.dirname(__file__), 'Games', 'out')
        return send_from_directory(games_dir, filename)
    except Exception as e:
        logger.error(f"Error serving games file {filename}: {e}")
        return jsonify({"error": "File not found"}), 404

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    })

@app.route('/api/stats')
def get_stats():
    try:
        return jsonify(asdict(dashboard_manager.get_stats()))
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        return jsonify({"error": "Failed to get statistics"}), 500

@app.route('/api/commands', methods=['GET'])
def get_commands():
    try:
        commands = dashboard_manager.command_handler.get_available_commands()
        return jsonify({"commands": commands})
    except Exception as e:
        logger.error(f"Error getting commands: {e}")
        return jsonify({"error": "Failed to get commands"}), 500

@app.route('/api/commands', methods=['POST'])
def execute_command():
    try:
        data = request.get_json() or {}
        command_request = CommandRequest(
            command=data.get('command', '').strip(),
            text=data.get('text', '').strip()
        )
        if not command_request.command:
            return jsonify({"error": "Command is required"}), 400
        
        result = dashboard_manager.execute_command(
            command_request.command,
            command_request.text
        )
        
        response = CommandResponse(
            id=result['history_entry']['id'],
            command=command_request.command,
            text=command_request.text,
            result=result['history_entry']['result'],
            status="completed" if result['success'] else "failed",
            timestamp=command_request.timestamp
        )
        return jsonify(asdict(response))
    except Exception as e:
        logger.error(f"Error executing command: {e}")
        return jsonify({"error": "Failed to execute command"}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        return jsonify({"history": dashboard_manager.get_history()})
    except Exception as e:
        logger.error(f"Error getting history: {e}")
        return jsonify({"error": "Failed to get history"}), 500

@app.route('/api/history', methods=['DELETE'])
def clear_history():
    try:
        dashboard_manager.clear_history()
        return jsonify({"success": True})
    except Exception as e:
        logger.error(f"Error clearing history: {e}")
        return jsonify({"error": "Failed to clear history"}), 500

# --- WebSocket Events ---
@socketio.on('connect')
def handle_connect():
    logger.info(f"Client connected: {request.sid}")
    emit('connected', {'message': 'Connected to A2 dashboard'})

@socketio.on('disconnect')
def handle_disconnect():
    logger.info(f"Client disconnected: {request.sid}")

@socketio.on('execute_command')
def handle_execute_command(data):
    try:
        command = data.get('command', '').strip()
        text = data.get('text', '').strip()
        if not command:
            emit('command_error', {'error': 'No command provided'})
            return
        
        result = dashboard_manager.execute_command(command, text)
        
        emit('command_result', {
            'command': command,
            'text': text,
            'success': result['success'],
            'result': 'success' if result['success'] else 'failed',
            'output': result['output']
        })
    except Exception as e:
        logger.error(f"WebSocket command error: {e}")
        emit('command_error', {'error': str(e)})

# --- Start Dashboard ---
def start_dashboard():
    try:
        logger.info("Starting A2 Web Dashboard...")
        socketio.run(app, debug=False, use_reloader=False, host='0.0.0.0', port=5000)
    except Exception as e:
        logger.error(f"Failed to start dashboard: {e}")
        raise

if __name__ == "__main__":
    start_dashboard()
