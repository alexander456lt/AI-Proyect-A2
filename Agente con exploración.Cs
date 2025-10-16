public class AgentController : MonoBehaviour
{
    public EmotionSystem emotionSystem;
    public float moveSpeed = 3f;

    void Update()
    {
        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");
        Vector3 movement = new Vector3(h, 0, v) * moveSpeed * Time.deltaTime;
        transform.Translate(movement);
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Target")) emotionSystem.ApplyReward();
        else emotionSystem.ApplyPenalty();

        Debug.Log("Estado emocional: " + emotionSystem.GetMood());
    }
}
