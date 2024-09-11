public class Logger
{
    private string filePath;

    public Logger()
    {
        filePath = "Logs/logs.log";
    }

    public void Log(string message)
    {
        using (StreamWriter writer = new StreamWriter(filePath, true))
        {
            writer.WriteLine($"Fecha: {DateTime.Now}, {message}");
        }
    }
}
