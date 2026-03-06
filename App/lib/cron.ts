import cron from "cron"
import https from "https"

const job = new cron.CronJob("*/14 * * * *", function(){
    const apiUrl = process.env.API_URL;
    
    console.log(`🔄 Pinging: ${apiUrl}/health`);
    
    https
        .get(apiUrl as string, (res) => {
            if(res.statusCode === 200) {
                console.log("✅ Get request sent successfully")
            } else {
                console.log("❌ Failed to send get request", res.statusCode)
            }
        })
        .on("error", (err) => console.log("❌ Error sending get request: ", err))
})

export default job