public class FrustrationHandler : MonoBehaviour
{
    public EmotionSystem emotionSystem;
    public AgentController agent;

    void Update()
    {
        if (emotionSystem.dopamine < 0.2f)
        {
            agent.enabled = false;
            Debug.Log("El agente se detuvo por frustración.");
        }
        else
        {
            agent.enabled = true;
        }
    }
}
