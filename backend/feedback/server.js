import express from "express"
import path from "path"
import fs from "fs"
import { cwd } from "process"

const app = express()
app.use(express.json())

const filePath = cwd() + "/data/feedback.txt"

app.post("/feedback", (request, response) => {
	if (!request.body?.message || !request.body?.userInfo) {
		return response.status(400).json({ error: "Invalid input" })
	}

	const entry = {
		message: request.body.message,
		userInfo: request.body.userInfo,
		createdDate: new Date().toLocaleString("en-GB"),
	}

	// let existing = [];
	// if (fs.existsSync(filePath) && fs.statSync(filePath).size != 0) {
	//     existing = JSON.parse(fs.readFileSync(filePath, "utf8"))
	// }

	// existing.push(entry)

	const content = `User: ${entry.userInfo}\nMessage: ${entry.message}\nDate: ${entry.createdDate} \n\n\n`
	console.log(content)
	fs.appendFile(filePath, content, (error) => {
		if (error) {
			console.error("Write failed:", error)
			return response.status(500).json({ status: "error" })
		}
	})

	response.json({ status: "ok" })
})

app.listen(3100, () => {
	console.log("Post API running on 3100!! :)")
})
