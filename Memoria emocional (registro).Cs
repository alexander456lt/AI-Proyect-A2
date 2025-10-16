using System.Collections.Generic;

public class EmotionMemory : MonoBehaviour
{
    public List<string> log = new List<string>();

    public void Record(string action, float dopamine)
    {
        string entry = $"Acción: {action}, Dopamina: {dopamine}";
        log.Add(entry);
        Debug.Log(entry);
    }
}
