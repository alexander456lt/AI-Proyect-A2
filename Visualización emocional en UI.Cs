using UnityEngine.UI;

public class EmotionUI : MonoBehaviour
{
    public EmotionSystem emotionSystem;
    public Text moodText;

    void Update()
    {
        moodText.text = "Estado emocional: " + emotionSystem.GetMood();
    }
}
