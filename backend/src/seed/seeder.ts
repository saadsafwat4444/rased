// backend/src/seed/seed.ts
import { db, admin } from '../firebase/firebase-admin';

async function seed() {
  try {
    console.log("🔹 Starting Firestore seed...");

    // 1️⃣ Stations
    const stations = [
      { stationNumber: 101, name: "Station A", region: "North", location: { lat: 30.1, lng: 31.2 }, address: "Address A" },
      { stationNumber: 102, name: "Station B", region: "South", location: { lat: 30.2, lng: 31.3 }, address: "Address B" },
      { stationNumber: 103, name: "Station C", region: "East", location: { lat: 30.3, lng: 31.4 }, address: "Address C" },
    ];

    const stationRefs: any[] = [];
    for (const st of stations) {
      const ref = db.collection('stations').doc();
      await ref.set({ ...st, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      stationRefs.push({ ...st, id: ref.id });
    }
    console.log(`✅ Added ${stations.length} stations`);

    // 2️⃣ Supervisors
    const supervisors = [
      {
        fullName: "Supervisor North",
        phone: "+201234567891",
        role: "supervisor",
        stationScopes: [stationRefs[0].stationNumber],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        fullName: "Supervisor South",
        phone: "+201234567893",
        role: "supervisor",
        stationScopes: [stationRefs[1].stationNumber],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    const supervisorRefs: any[] = [];
    for (const sup of supervisors) {
      const ref = db.collection('users').doc();
      await ref.set(sup);
      supervisorRefs.push({ ...sup, id: ref.id });
    }
    console.log(`✅ Added ${supervisors.length} supervisors`);

    // 3️⃣ Users
    const users = [
      { fullName: "User One", phone: "+201234567892", role: "user", stationScopes: [], createdAt: admin.firestore.FieldValue.serverTimestamp() },
      { fullName: "User Two", phone: "+201234567894", role: "user", stationScopes: [], createdAt: admin.firestore.FieldValue.serverTimestamp() },
    ];

    const userRefs: any[] = [];
    for (const user of users) {
      const ref = db.collection('users').doc();
      await ref.set(user);
      userRefs.push({ ...user, id: ref.id });
    }
    console.log(`✅ Added ${users.length} users`);

    // 4️⃣ Reports for each user
    const statuses = ["new", "in_review", "assigned", "resolved", "rejected"];
    const reportsRefs: any[] = [];

    for (const user of userRefs) {
      for (let i = 0; i < 2; i++) {
        const station = stationRefs[i % stationRefs.length];
        const reportData = {
          reporterId: user.id,
          stationId: station.id,
          stationNumber: station.stationNumber,
          description: `Sample report ${i + 1} by ${user.fullName}`,
          category: "Electrical",
          severity: "medium",
          media: [],
          location: station.location,
          status: statuses[i % statuses.length],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const ref = db.collection('reports').doc();
        await ref.set(reportData);
        reportsRefs.push({ ...reportData, id: ref.id });
      }
    }
    console.log(`✅ Added ${reportsRefs.length} reports`);

    // 5️⃣ report_events for each report
    for (const report of reportsRefs) {
      const events = [
        {
          reportId: report.id,
          action: "status_change",
          fromStatus: "new",
          toStatus: report.status,
          note: `Initial status set to ${report.status}`,
          actorId: report.reporterId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      ];
      for (const ev of events) {
        const ref = db.collection('report_events').doc();
        await ref.set(ev);
      }
    }
    console.log("✅ Added report_events for each report");

    console.log("🎉 Firestore seed completed!");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();