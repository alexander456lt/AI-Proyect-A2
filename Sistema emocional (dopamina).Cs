public class EmotionSystem : MonoBehaviour
{
    [Range(0f, 1f)] public float dopamine = 0.5f;
    public float rewardAmount = 0.1f;
    public float penaltyAmount = 0.2f;

    public void ApplyReward() => dopamine = Mathf.Clamp(dopamine + rewardAmount, 0f, 1f);
    public void ApplyPenalty() => dopamine = Mathf.Clamp(dopamine - penaltyAmount, 0f, 1f);

    public string GetMood()
    {
        if (dopamine > 0.8f) return "Eufórica";
        if (dopamine > 0.5f) return "Contenta";
        if (dopamine > 0.2f) return "Triste";
        return "Apática";
    }
}
