from abc import ABC, abstractmethod
from typing import Any

class BaseCommand(ABC):
    """Base class for all commands."""
    
    def __init__(self, assistant):
        self.assistant = assistant
        
    @abstractmethod
    def execute(self, text: str) -> bool:
        """Execute the command with the given text."""
        pass
        
    @abstractmethod
    def get_description(self) -> str:
        """Get a description of what this command does."""
        pass
