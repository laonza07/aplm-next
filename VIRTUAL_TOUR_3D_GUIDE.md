# คู่มือและโครงสร้างข้อมูลระบบทัวร์เสมือนจริง 3D / 360° (APLM Virtual Tour Guide)
**สำนักส่งเสริมวิชาการและจัดการเรียนรู้ตลอดชีวิต (APLM) มหาวิทยาลัยราชภัฏศรีสะเกษ**  
*อาคารพัชรกิติยาภา (ศูนย์บริการ One-Stop Service)*

---

## 1. บทนำและเป้าหมาย (Overview)
เอกสารนี้จัดทำขึ้นเพื่อเป็นแนวทางและแม่แบบโครงสร้างข้อมูล (Template) สำหรับการพัฒนาระบบ **3D / 360° Interactive Virtual Tour** บนเว็บไซต์ APLM เพื่อให้ผู้เรียน นักศึกษา บุคลากร และประชาชนทั่วไปสามารถเยี่ยมชมจุดบริการต่าง ๆ ภายในอาคารพัชรกิติยาภาได้เสมือนเดินทางมาด้วยตนเอง

---

## 2. เช็กลิสต์ไฟล์และข้อมูลที่ต้องเตรียม (Assets & Data Checklist)

### 2.1 ไฟล์รูปภาพพาโนรามา 360° (Panorama Images)
* **รูปแบบไฟล์:** JPG หรือ PNG แบบ **Equirectangular (อัตราส่วน 2:1)**
* **ความละเอียดที่แนะนำ:** `4096 x 2048` px (โหลดไวบนมือถือ) หรือ `6000 x 3000` px (คมชัดสูง)
* **ขนาดไฟล์:** ประมาณ 1.5 - 3.5 MB ต่อจุด (บีบอัดให้เหมาะกับเว็บ)
* **อุปกรณ์ถ่ายทำ:** 
  * กล้อง 360 องศา (Insta360, Ricoh Theta, GoPro MAX)
  * หรือกล้องมือถือถ่ายด้วยโหมด Panorama / Photo Sphere

### 2.2 ผังอาคารย่อมุมจอ (Mini Floor Plan)
* ภาพแผนผังชั้น 1 อาคารพัชรกิติยาภา (ขนาดประมาณ `600 x 400` px นามสกุล PNG พื้นหลังโปร่งใส)
* กำหนดจุดพิกัดตำแหน่งยืนเพื่อแสดงไอคอนบอกตำแหน่งปัจจุบัน (User Location Marker)

### 2.3 ข้อมูลเนื้อหาประจำแต่ละจุด (Hotspot Content)
สำหรับแต่ละจุดบริการ ให้เตรียมข้อมูลตามฟิลด์ต่อไปนี้:
* **รหัสจุด (ID):** เช่น `scene_entrance`, `scene_counters`
* **ชื่อภาษาไทย & ภาษาอังกฤษ:** เช่น "เคาน์เตอร์บริการนักศึกษา (One-Stop Service)"
* **คำอธิบายบริการ (Description):** หน้าที่ ขอบข่ายบริการ สิ่งที่ต้องเตรียม
* **เวลาให้บริการ (Hours):** วันและเวลาทำการ
* **ลิงก์ด่วน (Action URLs):** เช่น ลิงก์ดาวน์โหลดแบบคำร้อง, ลิงก์ LINE Official, เบอร์โทรภายใน
* **ภาพประกอบระยะใกล้ (Detail Photos):** ภาพนิ่งขนาดปกติ 1-2 ภาพเพื่อกดดูขยาย

---

## 3. แม่แบบโครงสร้างข้อมูล JSON (Tour Data Schema)

ไฟล์โครงสร้างข้อมูลจำลองที่พร้อมนำไปใช้งาน (`assets/tour/tour-data.json`):

```json
{
  "scenes": [
    {
      "id": "entrance",
      "title": "ประตูทางเข้าอาคารพัชรกิติยาภา",
      "panorama": "assets/tour/entrance_360.jpg",
      "defaultPitch": 0,
      "defaultYaw": 0,
      "navigationHotspots": [
        {
          "targetScene": "counter_hall",
          "pitch": -2,
          "yaw": 3,
          "tooltip": "เดินเข้าสู่โถงเคาน์เตอร์บริการ"
        }
      ],
      "infoHotspots": [
        {
          "pitch": 5,
          "yaw": -25,
          "title": "จุดตรวจคัดกรองและประชาสัมพันธ์",
          "description": "ติดต่อสอบถามจุดแรกรับ ตรวจสอบลำดับคิว และรับเอกสารเบื้องต้น",
          "linkText": "แผนที่อาคาร",
          "linkUrl": "#campus-map"
        }
      ]
    },
    {
      "id": "counter_hall",
      "title": "ศูนย์บริการ One-Stop Service (เคาน์เตอร์ 1–4)",
      "panorama": "assets/tour/counter_hall_360.jpg",
      "defaultPitch": -5,
      "defaultYaw": 90,
      "navigationHotspots": [
        {
          "targetScene": "entrance",
          "pitch": -3,
          "yaw": -175,
          "tooltip": "กลับไปยังประตูทางเข้า"
        },
        {
          "targetScene": "waiting_area",
          "pitch": -2,
          "yaw": 45,
          "tooltip": "ไปยังพื้นที่พักคอยและให้คำปรึกษา"
        }
      ],
      "infoHotspots": [
        {
          "pitch": -2,
          "yaw": 65,
          "title": "เคาน์เตอร์ที่ 1: ลงทะเบียนและประมวลผล",
          "description": "บริการงานลงทะเบียนเรียน เพิ่ม-ถอนรายวิชา และตรวจสอบตารางสอบ",
          "linkText": "ปฏิทินการศึกษา",
          "linkUrl": "#directory"
        },
        {
          "pitch": -2,
          "yaw": 85,
          "title": "เคาน์เตอร์ที่ 2: งานเอกสารและรับรองวุฒิ",
          "description": "ขอใบรับรองผลการศึกษา (Transcript), หนังสือรับรองการเป็นนักศึกษา และตรวจสอบวุฒิการศึกษา",
          "linkText": "ยื่นคำร้องออนไลน์",
          "linkUrl": "#directory"
        },
        {
          "pitch": -2,
          "yaw": 105,
          "title": "เคาน์เตอร์ที่ 3: รับสมัครนักศึกษาและหลักสูตร",
          "description": "สอบถามการรับสมัครนักศึกษาใหม่ ภาคปกติและภาคพิเศษ รวมทั้งหลักสูตรระยะสั้น (Lifelong Learning)",
          "linkText": "สมัครเรียนออนไลน์",
          "linkUrl": "https://www.facebook.com/profile.php?id=61591746698301"
        },
        {
          "pitch": -2,
          "yaw": 125,
          "title": "เคาน์เตอร์ที่ 4: การเงินและทุนการศึกษา",
          "description": "ชำระค่าธรรมเนียมการศึกษา งานสิทธิประโยชน์ และประสานงานทุนการศึกษา",
          "linkText": "สอบถามข้อมูล",
          "linkUrl": "tel:045643622"
        }
      ]
    },
    {
      "id": "waiting_area",
      "title": "พื้นที่พักคอยและบริการดิจิทัล",
      "panorama": "assets/tour/waiting_360.jpg",
      "defaultPitch": 0,
      "defaultYaw": 0,
      "navigationHotspots": [
        {
          "targetScene": "counter_hall",
          "pitch": -3,
          "yaw": -90,
          "tooltip": "เดินกลับไปยังเคาน์เตอร์บริการ"
        }
      ],
      "infoHotspots": [
        {
          "pitch": 8,
          "yaw": 15,
          "title": "จุดบริการ Self-Service Kiosk",
          "description": "เครื่องบริการตนเองสำหรับพิมพ์ใบเสร็จและตรวจสอบสถานะคำร้องแบบอัตโนมัติ"
        }
      ]
    }
  ]
}
```

---

## 4. โค้ดตัวอย่างหน้าเว็บสำหรับทดสอบ (Quick Interactive HTML Prototype)

สามารถคัดลอกโค้ดด้านล่างนี้บันทึกเป็น `tour-demo.html` เพื่อทดสอบระบบได้ทันที โดยใช้ไลบรารี **Pannellum (Web-standard 360 viewer น้ำหนักเบา ไม่ต้องลงโปรแกรมเพิ่ม)**:

```html
<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>APLM 360° Virtual Tour Preview</title>
  <!-- Pannellum 360 Engine -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css">
  <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
  <style>
    body { margin: 0; padding: 0; font-family: sans-serif; background: #061b3e; color: #fff; }
    #panorama { width: 100vw; height: 100vh; }
    .tour-topbar {
      position: absolute; top: 16px; left: 16px; z-index: 10;
      background: rgba(6, 27, 62, 0.85); backdrop-filter: blur(8px);
      padding: 12px 20px; border-radius: 12px; border: 1px solid #e4b04a;
    }
    .tour-topbar h1 { margin: 0; font-size: 16px; color: #e4b04a; }
    .tour-topbar p { margin: 4px 0 0; font-size: 12px; color: #d0dff4; }
    .tour-nav {
      position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 10px; z-index: 10;
      background: rgba(6, 27, 62, 0.85); backdrop-filter: blur(8px);
      padding: 8px 14px; border-radius: 30px; border: 1px solid rgba(228, 176, 74, 0.4);
    }
    .nav-btn {
      background: none; border: 1px solid transparent; color: #fff;
      padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 13px;
      transition: background .2s, border-color .2s;
    }
    .nav-btn.active, .nav-btn:hover {
      background: #e4b04a; color: #061b3e; font-weight: bold;
    }
  </style>
</head>
<body>

  <div class="tour-topbar">
    <h1>สำนักส่งเสริมวิชาการและจัดการเรียนรู้ตลอดชีวิต (APLM)</h1>
    <p>ระบบทัวร์เสมือนจริง 360° อาคารพัชรกิติยาภา</p>
  </div>

  <div id="panorama"></div>

  <div class="tour-nav">
    <button class="nav-btn active" onclick="loadScene('entrance')">1. ประตูทางเข้า</button>
    <button class="nav-btn" onclick="loadScene('counter_hall')">2. เคาน์เตอร์บริการ 1-4</button>
    <button class="nav-btn" onclick="loadScene('waiting_area')">3. โถงพักคอย</button>
  </div>

  <script>
    // ตัวอย่างภาพจำลอง (หากมีไฟล์ภาพจริงให้นำมาแทนที่ URL ด้านล่าง)
    const viewer = pannellum.viewer('panorama', {
      default: {
        firstScene: 'entrance',
        author: 'APLM SSKRU',
        autoLoad: true,
        compass: true
      },
      scenes: {
        entrance: {
          title: "ทางเข้าอาคารพัชรกิติยาภา",
          hfov: 110,
          pitch: 0,
          yaw: 0,
          type: "equirectangular",
          panorama: "https://pannellum.org/images/alma.jpg",
          hotSpots: [
            {
              pitch: -2,
              yaw: 20,
              type: "scene",
              text: "เดินเข้าสู่เคาน์เตอร์บริการ 1-4",
              sceneId: "counter_hall"
            }
          ]
        },
        counter_hall: {
          title: "จุดบริการ One-Stop Service เคาน์เตอร์ 1-4",
          hfov: 110,
          pitch: -5,
          yaw: 90,
          type: "equirectangular",
          panorama: "https://pannellum.org/images/cerro-tolo.jpg",
          hotSpots: [
            {
              pitch: 0,
              yaw: -170,
              type: "scene",
              text: "กลับไปทางเข้า",
              sceneId: "entrance"
            },
            {
              pitch: -3,
              yaw: 80,
              type: "info",
              text: "เคาน์เตอร์ที่ 2: ขอเอกสารทางการศึกษา / หนังสือรับรองวุฒิ",
              URL: "https://app.sskru.ac.th"
            }
          ]
        },
        waiting_area: {
          title: "โถงพักคอยและให้คำปรึกษา",
          hfov: 110,
          pitch: 0,
          yaw: 0,
          type: "equirectangular",
          panorama: "https://pannellum.org/images/bma.jpg",
          hotSpots: [
            {
              pitch: -5,
              yaw: 120,
              type: "scene",
              text: "ไปยังเคาน์เตอร์บริการ",
              sceneId: "counter_hall"
            }
          ]
        }
      }
    });

    function loadScene(sceneId) {
      viewer.loadScene(sceneId);
      document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
    }
  </script>
</body>
</html>
```

---

## 5. แนะนำขั้นตอนการลงมือปฏิบัติจริง (Next Steps)
1. **จัดเตรียมภาพ 360°:** นำกล้อง 360° ไปตั้งถ่าย ณ กึ่งกลางห้องโถงอาคารพัชรกิติยาภา และหน้าเคาน์เตอร์ 1-4 (ความสูงระดับสายตาประมาณ 1.5 - 1.6 เมตร)
2. **นำภาพมาใส่ในโฟลเดอร์:** นำไฟล์ภาพที่ได้มาวางใน `D:\dev\aplm-next\assets\tour\`
3. **ปรับแก้พิกัด Hotspot:** ปรับค่า `pitch` (องศาก้ม/เงย) และ `yaw` (องศาซ้าย/ขวา) ให้ตรงกับป้ายเคาน์เตอร์จริง
4. **เชื่อมต่อเข้ากับหน้าเว็บหลัก:** สามารถฝังเป็น Iframe หรือเป็น Modal Pop-up แบบเต็มจอเมื่อกดปุ่ม "สำรวจสำนักแบบ 3D" บนหน้าแรก
