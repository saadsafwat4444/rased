Rased – Vibe Coding Tasks

Platform Overview:
Rased is a platform for reporting issues related to electricity stations. It allows users to submit reports with images/videos, specify the location of the issue, and select the affected station. The system supports multiple roles: User, Supervisor, Admin.

🌐 Features

Submit reports with images and videos.

Specify location via GPS or select a station from the list.

Track report status: New / In Review / Assigned / Resolved / Rejected.

Admin/Supervisor dashboard for managing reports and users.


🖥️ Tech Stack
Frontend

Next.js (App Router)

Tailwind CSS + shadcn/ui

Google Maps أو Mapbox

Firebase Storage لرفع الوسائط

Backend

NestJS

Firebase Auth (JWT verification في Backend)

Firestore  

Cloudinary Storage

 

Integrations

Google/Mapbox Reverse Geocoding

Video thumbnailing (اختياري)

 

👥 Roles & Permissions (RBAC)
Role	Permissions
User	إنشاء تقارير، متابعة حالتها، تعديل قبل التحويل
Supervisor	إدارة التقارير في نطاق محطات معينة، تغيير الحالة، تعيين المسؤوليات
Admin	إدارة المستخدمين والأدوار، إدارة المحطات، إعدادات النظام، التقارير
📂 Firestore Data Model
users
{
  "id": "...",
  "fullName": "...",
  "phone": "...",
  "role": "user | supervisor | admin",
  "stationScopes": ["stationId"],
  "createdAt": "timestamp"
}
stations
{
  "id": "...",
  "stationNumber": "unique",
  "name": "...",
  "region": "...",
  "location": { "lat": 0, "lng": 0 },
  "address": "...",
  "statusMeta": {}
}
reports
{
  "id": "...",
  "reporterId": "...",
  "stationId": "...",
  "stationNumber": "...",
  "description": "...",
  "category": "...",
  "severity": "low | medium | high",
  "media": [{ "type": "image|video", "url": "...", "thumbUrl": "...", "size": 0, "mimeType": "..." }],
  "location": { "lat": 0, "lng": 0, "accuracy": 0, "addressText": "..." },
  "status": "new | in_review | assigned | resolved | rejected",
  "assignedToUserId": "...",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
report_events
{
  "id": "...",
  "reportId": "...",
  "action": "status_change | comment | assignment",
  "fromStatus": "...",
  "toStatus": "...",
  "note": "...",
  "actorId": "...",
  "createdAt": "timestamp"
}
🚀 Getting Started
1️⃣ Clone Repository
git clone https://github.com/saadsafwat4444/rased.git
cd Vibe-Coding-Tasks
2️⃣ Frontend Setup
cd frontend
npm install
cp .env.example .env.local:FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC+z/yixOKRDgdI\n42OEHGqGUiNh9PVgEYSzoLL9tj+FT9M84SJrxDRrL/j7FIq/8G+Q1Md/l+6ynknj\nx83ka2EG/VXd6pZ0DJ+NuEQIvg3YOtxsspPDBFaY3+UgjueBfye531LggpssD13u\npWU9H9sRnWdKLy+TtUMR0fh1QfTBQ3ZmLMpo/osSjnS8X4W2Ne1bVW52yM/k5wqv\nKJjxqTo6XTOM82VFIiIoO/KRuZbInvBsydw8VRW7F5dId5WYFYvCEBFEQSTG88XI\nl9LADmDSiHJ1+mOOwgmT1JAAWjiaPdE3mtdnwuEP6PgQfLO6K1Hje6TSl3aQpkM1\nk26bsrUbAgMBAAECggEANu6DiYxquV2zhS1JMfhIRoERBJtTpKOGc3v464dzA/r2\nEhmyIhorCQyXfhjs1NLwG17WTAo+QpfFJ9kWkgLDvRJjjO6C/8e+izsYAvhL3gsb\n+AL0/PibwYj7WoMpbKNhmWYMYuvWpjmKTjC5U35/P7Pzz2yEIt7U/yVWhNNHFffI\n8Ls+T0OkGuMnlChxK1QFvqfgfD2E2Zcu0BE+DegIFboHzU1t+7zdaEN6/Yu5Pqgj\nZD1mmzal5VnpPKYU+1+WnqPK/LBZ1tpPH0SjwAW/mg6oqwrJh69X409IPlieEpkN\nyF3RIqelBABZKNSXmBFULZ1E1mUwJeFFFBAzC8r0UQKBgQD2sk+aYJgnsKPKOYFc\npbkYSOZOOo93giQ2lYu3mpzZvdgJx+Q/nfHMRqcLNy25/DbSndyyR4Io/5EvYe3N\nuTHme2E/xf2mMja9x2H8g/viP6lGaf1nHPk7Dl0F77x6Wmu4QAbo13IQ12rv+d0g\n3oD86KXbCdMgwmaJlhJH2tkT+QKBgQDGAicYeIFDQh8ro9No2pOj503vX3Y2i0bR\nqvkhxo3xtxFAoOHIfQT7S4b+DcBnOIe7E9upkyqy7hWg8v1q/KorOQ3poBXzawND\nVSmxUaPAiJw91uNK+TcH4XzBeIbjSfDyj+Q87hCHjTy8q9rZcmaUjL8YZF89wtT+\nmgTcZasuswKBgGs7ULyy9hByiI+TdXaXFqDGt00TyV7SM/mCAYxaaYmAKtL9j2pT\ntlHr+Bo47uhkCFR+h/r6eEpn5GzrLVn6AQXFZZ0566p9MyxE6YPAvxE2SNcxpRNY\nFcGk2ayF67Bnc2FQe3BkjdFiQbp0Krlp3jmQyt8uIxafScDOeb3AFBHJAoGAOPeP\nleu9jMMuQpjsjuMrzOEUPAUj9odVhacB7CS628sGjKh8rPjDASV2ngsIyumpqzoI\nXZ44j6gN0vN1010D/FF63jcveYvVMX8D8r8BNLhY8zWqyPwwR/UotmTdsfCpALBD\nQwBfAxCwY7uxyBOwzZY8uGDQQe2W5/UZ5urdOB8CgYByME7goA3OHmp3jPxTN+qZ\nJ7OHYzSU84aX4WnC+eSaFXTbUQlAqsAYM/c1s5JwuZ6Me6g2uYQuO5HAuoEtBbif\ndrzbhBn0k2agV9b3GXY4FvVYtjt7knYXtATvECCSKhWL6+fKyW2y8TDYHl0bS5Zw\nyUCwQ9tdjG3pQ5iNuzX/rg==\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_API_URL=https://rased-production.up.railway.app

npm run dev
3️⃣ Backend Setup
cd backend
npm install
cp .env.example .env
# ضع مفاتيح Firebase Admin و DB هنا
npm run start:dev
🔐 Default Admin Account

  ، يمكنك تسجيل الدخول كادمن باستخدام:

Email: admin@example.com
Password: StrongTempPassword123!


📦 Deployment

Frontend: Vercel

Backend: Railway

Firebase: Firestore + Cloudinary Storage + Auth Firebase
visit website:
https://rased-qftd.vercel.app/
