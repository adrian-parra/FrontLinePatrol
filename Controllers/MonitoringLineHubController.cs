using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
public class LineMonitoringHub : Hub
{
    public async Task NotifyNewRecord(string lineId, string message)
    {
        await Clients.All.SendAsync("ReceiveNotification", lineId, message);
    }

    public async Task UpdateRecordList()
    {
        await Clients.All.SendAsync("RefreshRecordList");
    }
}
