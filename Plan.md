# BuddhistMap

## 1. Tổng quan

Xây dựng **BuddhistMap**, một website dạng wiki có cấu trúc, giúp khám phá và tra cứu hệ thống Kinh Phật cùng các cấu trúc kinh điển liên quan.

Ý tưởng cốt lõi:

> **BuddhistMap là bản đồ/chỉ mục/wiki của hệ thống Kinh Phật, không phải website sao chép và lưu trữ toàn bộ nội dung Kinh Phật.**

Website giúp người dùng:

* Hiểu cấu trúc và hệ thống của Kinh Phật.
* Nhanh chóng tìm một bộ kinh hoặc một kinh cụ thể.
* Điều hướng từ truyền thống → kinh điển → bộ → kinh.
* Xem mối quan hệ giữa các kinh.
* Xem các tên gọi khác nhau và tên gốc.
* Tìm các nguồn bên ngoài để đọc hoặc nghe nội dung.
* Khám phá hệ thống văn bản Phật giáo mà không cần có kiến thức chuyên sâu từ trước.

BuddhistMap chủ yếu là một **hệ thống điều hướng và tra cứu tri thức**, không phải nền tảng xuất bản nội dung.

---

# 2. Nguyên tắc cốt lõi

## 2.1 Ưu tiên cấu trúc hơn nội dung

Không viết lại hoặc sao chép toàn bộ nội dung các bộ kinh.

Dữ liệu chủ yếu bao gồm:

* Tên
* Mã định danh
* Cấu trúc phân cấp
* Metadata
* Mối quan hệ giữa các văn bản
* Liên kết tới nguồn bên ngoài
* Thông tin ngôn ngữ
* Truyền thống / tông phái

Ví dụ:

```text
BuddhistMap
└── Theravāda
    └── Kinh điển Pāli
        └── Sutta Piṭaka
            └── Dīgha Nikāya
                └── DN 1
                    ├── Tên
                    ├── Tên Pāli
                    ├── Tên gọi khác
                    ├── Mô tả ngắn
                    ├── Văn bản liên quan
                    └── Nguồn bên ngoài
                        ├── Đọc
                        ├── Nghe
                        └── Tham khảo
```

---

# 3. Đối tượng người dùng

Website phục vụ ba nhóm người dùng.

### Người mới

Những người biết rất ít về hệ thống Kinh Phật.

Họ có thể tìm hiểu:

* Kinh Phật gồm những hệ thống nào?
* Tam Tạng là gì?
* Nikāya là gì?
* Một kinh cụ thể nằm ở đâu?
* Có thể đọc hoặc nghe kinh đó ở đâu?

### Người đọc / hành trì

Những người đã quen với thuật ngữ Phật giáo và muốn nhanh chóng tìm một kinh cụ thể cùng các nguồn đọc/nghe bên ngoài.

### Người nghiên cứu

Những người muốn tra cứu:

* Các truyền thống Phật giáo
* Tên gốc
* Tên gọi khác
* Mã định danh
* Mối quan hệ giữa các văn bản
* Các nguồn tham khảo

---

# 4. Cấu trúc thông tin của website

Navigation chính:

```text
Trang chủ
├── Bản đồ
├── Truyền thống
├── Kinh điển
├── Bộ kinh
├── Văn bản / Kinh
├── Khái niệm
├── Nguồn tham khảo
└── Giới thiệu
```

Cấu trúc này có thể thay đổi trong quá trình phát triển.

---

# 5. Cấu trúc phân cấp chính

Hệ thống phải hỗ trợ quan hệ phân cấp.

Ví dụ:

```text
Truyền thống
    ↓
Kinh điển
    ↓
Tạng
    ↓
Bộ / Tuyển tập
    ↓
Kinh
    ↓
Phẩm / Phần
```

Tuy nhiên, **không được giả định tất cả các truyền thống Phật giáo đều có cùng một cấu trúc**.

Ví dụ:

```text
Theravāda
└── Kinh điển Pāli
    ├── Vinaya Piṭaka
    ├── Sutta Piṭaka
    └── Abhidhamma Piṭaka
```

Các truyền thống khác có thể có cấu trúc khác.

Do đó:

> **Không hard-code cấu trúc phân cấp vào frontend.**

Cấu trúc phải được lấy từ dữ liệu có cấu trúc.

---

# 6. Mô hình dữ liệu

Sử dụng dữ liệu có cấu trúc thay vì hard-code từng trang.

Trong phiên bản đầu tiên ưu tiên:

```text
JSON / YAML
```

Ví dụ:

```json
{
  "id": "dn-01",
  "type": "text",
  "title": "Brahmajāla Sutta",
  "titles": {
    "english": "Brahmajāla Sutta",
    "pali": "Brahmajāla Sutta",
    "vietnamese": "Kinh Phạm Võng"
  },
  "identifier": "DN 1",
  "tradition": "theravada",
  "collection": "digha-nikaya",
  "parent": "digha-nikaya",
  "tags": [
    "sutta"
  ],
  "related": [
    "dn-02"
  ],
  "resources": [
    {
      "type": "read",
      "language": "vi",
      "title": "Bản dịch tiếng Việt",
      "url": "https://example.com"
    },
    {
      "type": "listen",
      "language": "vi",
      "title": "Audio tiếng Việt",
      "url": "https://example.com"
    }
  ]
}
```

---

# 7. Các loại đối tượng

Mô hình dữ liệu nên hỗ trợ tối thiểu:

```text
Tradition       — Truyền thống
Canon           — Kinh điển
Collection      — Bộ / Tuyển tập
Piṭaka          — Tạng
Text            — Văn bản / Kinh
Section         — Phẩm / Phần
Concept         — Khái niệm
Person          — Nhân vật
Place           — Địa điểm
Resource        — Nguồn tham khảo
```

Tuy nhiên không cần triển khai tất cả ngay.

Phiên bản 1 tập trung vào:

```text
Tradition
Canon
Collection
Text
Resource
```

---

# 8. Trang chi tiết của một kinh

Mỗi kinh hoặc văn bản phải có một trang riêng.

Ví dụ:

```text
------------------------------------------------
DN 1 — Brahmajāla Sutta
Kinh Phạm Võng
------------------------------------------------

Truyền thống
Theravāda

Kinh điển
Kinh điển Pāli

Bộ kinh
Dīgha Nikāya

Mã định danh
DN 1

Tên gốc
Brahmajāla Sutta

------------------------------------------------
Nguồn bên ngoài
------------------------------------------------

ĐỌC

🇻🇳 Tiếng Việt
[Đọc]

🇬🇧 Tiếng Anh
[Đọc]

Pāli
[Đọc]


NGHE

🇻🇳 Tiếng Việt
[Nghe]

🇬🇧 Tiếng Anh
[Nghe]


THAM KHẢO

[Nguồn A]
[Nguồn B]

------------------------------------------------
Các văn bản liên quan
------------------------------------------------

DN 2 — Sāmaññaphala Sutta
DN 3 — Ambaṭṭha Sutta
...
```

Trang phải phân biệt rõ:

* Metadata do BuddhistMap cung cấp.
* Nội dung đến từ nguồn bên ngoài.

BuddhistMap không được khiến người dùng hiểu rằng nội dung bên ngoài được lưu trữ trên BuddhistMap.

---

# 9. Nguồn nội dung bên ngoài

Nguồn bên ngoài là một tính năng cốt lõi.

Mỗi nguồn nên có:

```text
Loại nguồn
Ngôn ngữ
Tên
Nhà cung cấp / website
URL
Mô tả tùy chọn
```

Các loại nguồn:

```text
read          — Đọc
listen        — Nghe
video         — Video
translation   — Bản dịch
original      — Bản gốc
reference     — Tham khảo
```

Ví dụ:

```json
{
  "type": "listen",
  "language": "vi",
  "provider": "Website bên ngoài",
  "url": "https://example.com"
}
```

Giao diện nên nhóm các nguồn theo mục đích:

```text
📖 Đọc
🎧 Nghe
🎥 Xem
🌐 Tham khảo
```

Không nên mặc định nhúng nội dung từ website bên ngoài.

Ưu tiên mở nguồn bên ngoài trong tab mới.

---

# 10. Tìm kiếm

Search là một trong những tính năng quan trọng nhất.

Người dùng có thể tìm kiếm bằng:

* Tên tiếng Anh
* Tên tiếng Việt
* Tên Pāli / Sanskrit
* Mã định danh
* Tên gọi khác
* Từ khóa

Ví dụ:

```text
DN 1
Phạm Võng
Brahmajāla
Satipatthana
Niệm Xứ
MN 10
```

Kết quả tìm kiếm nên hiển thị:

```text
DN 1
Brahmajāla Sutta
Kinh Phạm Võng

Theravāda → Kinh điển Pāli → Sutta Piṭaka → Dīgha Nikāya
```

---

# 11. Breadcrumb / đường dẫn phân cấp

Mỗi trang phải hiển thị vị trí của nó trong hệ thống.

Ví dụ:

```text
Trang chủ
>
Theravāda
>
Kinh điển Pāli
>
Sutta Piṭaka
>
Dīgha Nikāya
>
DN 1
```

Mỗi thành phần đều có thể click.

Đây là thành phần rất quan trọng vì website được thiết kế như một "bản đồ".

---

# 12. Sidebar

Cung cấp sidebar dạng cây có thể mở rộng / thu gọn.

Ví dụ:

```text
BuddhistMap

THERAVĀDA
  Kinh điển Pāli
    Vinaya Piṭaka
    Sutta Piṭaka
      Dīgha Nikāya
      Majjhima Nikāya
      Saṃyutta Nikāya
      Aṅguttara Nikāya
      Khuddaka Nikāya
    Abhidhamma Piṭaka

MAHĀYĀNA

VAJRAYĀNA
```

Sidebar phải được sinh ra từ dữ liệu có cấu trúc, không được tạo thủ công ở nhiều nơi.

---

# 13. Chế độ Map / Bản đồ

Website về sau nên có chế độ hiển thị trực quan.

Ví dụ:

```text
                 Các truyền thống Phật giáo
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Theravāda         Mahāyāna         Vajrayāna
        │
    Kinh điển Pāli
        │
   ┌────┼────┐
   ↓    ↓    ↓
 Vinaya Sutta Abhidhamma
        │
      Nikāya
        │
       Kinh
```

Trong Version 1, chỉ cần cây phân cấp thông thường.

**Không nên over-engineer graph tương tác ngay từ đầu.**

Sau này mới bổ sung:

* Đồ thị quan hệ.
* Quan hệ giữa các kinh.
* Quan hệ giữa kinh và khái niệm.
* Cross-reference.
* Interactive knowledge graph.

---

# 14. Trang chủ

Trang chủ phải giải thích ngay BuddhistMap là gì.

Ví dụ:

```text
BuddhistMap

Khám phá cấu trúc hệ thống Kinh Phật.

[ Tìm kiếm kinh... ]

--------------------------------

Khám phá theo truyền thống

Theravāda
Mahāyāna
Vajrayāna

--------------------------------

Khám phá theo kinh điển

Kinh điển Pāli
Kinh điển Phật giáo Hán truyền
Kinh điển Tây Tạng
...

--------------------------------

Các bộ kinh

Dīgha Nikāya
Majjhima Nikāya
...
```

Giữ homepage đơn giản.

Đây là công cụ tra cứu, không phải blog.

---

# 15. Thiết kế giao diện

Giao diện nên mang cảm giác:

* Bình tĩnh
* Sạch sẽ
* Học thuật
* Trung lập
* Có tính lâu dài
* Dễ đọc

Tránh:

* Trang trí tôn giáo quá mức.
* Quá nhiều màu sắc.
* Animation nặng.
* Thiết kế giống mạng xã hội.
* Các section marketing lớn.

Ưu tiên:

```text
Kiến trúc thông tin
Khả năng tra cứu
Khả năng đọc
```

Phong cách gợi ý:

```text
Nền trắng / màu trung tính ấm
Typography dễ đọc
Border nhẹ
Hierarchy rõ ràng
Khoảng trắng hợp lý
Icon đơn giản
```

Website phải responsive:

* Desktop
* Tablet
* Mobile

---

# 16. Cấu trúc URL

URL phải ổn định và dễ đọc.

Ví dụ:

```text
/traditions/theravada

/canons/pali-canon

/collections/digha-nikaya

/texts/dn-01
/texts/mn-010
/texts/sn-xxx
```

Không sử dụng URL dựa trên database index.

Không nên:

```text
/text?id=29384
```

Nên:

```text
/texts/dn-01
```

---

# 17. Công nghệ

Sử dụng kiến trúc static-first.

Đề xuất:

```text
Frontend:
Astro

Ngôn ngữ:
TypeScript

Dữ liệu:
JSON / YAML

CSS:
CSS / Tailwind CSS

Hosting:
GitHub Pages

Repository:
GitHub

Deployment:
GitHub Actions
```

Không cần backend trong Version 1.

Không cần database trong Version 1.

Không cần authentication.

Không cần server.

---

# 18. Kiến trúc Static

Dữ liệu ban đầu chủ yếu là metadata có cấu trúc và external links.

Do đó:

```text
Git Repository
      ↓
JSON / YAML
      ↓
Astro Build
      ↓
Static HTML / CSS / JS
      ↓
GitHub Pages
```

Ưu điểm:

* Hosting miễn phí.
* Tốc độ nhanh.
* Deployment đơn giản.
* Version control bằng Git.
* Backup dễ dàng.
* Dễ đóng góp.
* Không cần quản trị database.
* Không cần bảo trì backend.

---

# 19. Cấu trúc Repository

Tách riêng dữ liệu và giao diện.

Đề xuất:

```text
buddhist-map/
│
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── lib/
│
├── data/
│   ├── traditions/
│   ├── canons/
│   ├── collections/
│   ├── texts/
│   └── resources/
│
├── public/
│   └── assets/
│
├── scripts/
│
├── astro.config.ts
├── package.json
└── README.md
```

Không trộn dữ liệu với UI components.

---

# 20. Kiểm tra tính hợp lệ của dữ liệu

Vì dự án chủ yếu là một hệ thống chỉ mục có cấu trúc nên tính nhất quán của dữ liệu rất quan trọng.

Tạo schema cho các entity:

```text
TextSchema
CollectionSchema
TraditionSchema
ResourceSchema
```

Validate dữ liệu trong quá trình build.

Build phải fail nếu:

* Entity có ID không hợp lệ.
* Parent không tồn tại.
* Relationship trỏ tới entity không tồn tại.
* URL nguồn không hợp lệ.
* Thiếu field bắt buộc.

Điều này giúp tránh việc knowledge map bị sai lệch hoặc mất tính nhất quán.

---

# 21. Quản lý External Links

Các external link có thể thay đổi hoặc bị chết.

Do đó thiết kế hệ thống resource để URL có thể cập nhật độc lập với UI.

Ví dụ:

```text
Text
 └── Resources
       ├── Đọc / Tiếng Việt
       ├── Đọc / Tiếng Anh
       ├── Nghe / Tiếng Việt
       └── Tham khảo
```

Không hard-code URL trực tiếp trong các component Astro/React.

---

# 22. Hỗ trợ quốc tế hóa

Website hướng tới người dùng quốc tế.

Version 1 có thể sử dụng:

```text
English UI
```

hoặc:

```text
English + Vietnamese UI
```

Metadata có thể chứa nhiều tên:

```text
English
Vietnamese
Pāli
Sanskrit
Chinese
Tibetan
```

Không giả định một tên tiếng Anh hoặc tiếng Việt là tên duy nhất/canonical.

Hỗ trợ:

```text
Tên chính
Tên gọi khác
Tên gốc
Phiên âm
Mã định danh
```

---

# 23. Nguyên tắc về tên gọi

Ưu tiên sử dụng mã định danh khi có thể.

Ví dụ:

```text
DN 1
MN 10
SN 56.11
AN 3.65
```

Tên gọi có thể khác nhau giữa các ngôn ngữ và bản dịch.

Mã định danh cung cấp một cách tham chiếu ổn định hơn.

---

# 24. Các văn bản liên quan

Trang của mỗi kinh nên hiển thị các văn bản liên quan.

Ví dụ:

```text
Các văn bản liên quan

DN 1
├── DN 2
├── DN 3
└── DN 4
```

Về sau hỗ trợ nhiều loại relationship:

```text
related       — liên quan
parallel      — tương đương/song song
commentary    — chú giải
translation   — bản dịch
contains      — chứa
part-of       — thuộc về
references    — tham chiếu
```

Ví dụ:

```json
{
  "from": "mn-010",
  "relation": "parallel",
  "to": "dn-022"
}
```

---

# 25. Không sao chép nội dung

Trong giai đoạn đầu, dự án KHÔNG:

* Sao chép toàn bộ kinh.
* Host file audio.
* Host video.
* Sao chép toàn bộ bản dịch.
* Scrape website bên ngoài.
* Mirror nội dung từ nguồn khác.

Thay vào đó:

```text
BuddhistMap
    ↓
Metadata + Structure
    ↓
External References
    ↓
Nguồn gốc bên ngoài
```

Điều này giúp dự án nhẹ, dễ bảo trì và thuận lợi hơn trong việc tôn trọng bản quyền cũng như ghi nhận nguồn.

---

# 26. Phạm vi Version 1

Version 1 chỉ cần triển khai:

### Core

* Trang chủ.
* Điều hướng theo truyền thống.
* Điều hướng theo kinh điển.
* Điều hướng theo bộ kinh.
* Trang chi tiết từng kinh.
* Breadcrumb.
* Sidebar / cây phân cấp.
* Search.
* External resources.
* Responsive design.

### Data

* Cấu trúc Phật giáo ban đầu.
* Metadata của các bộ kinh.
* Metadata của các kinh.
* External resource links.

### Technical

* Astro.
* TypeScript.
* JSON/YAML.
* Static generation.
* GitHub Actions.
* GitHub Pages.

KHÔNG triển khai ban đầu:

* User account.
* Comment.
* CMS.
* Admin dashboard.
* Database.
* AI chatbot.
* RAG.
* Graph database phức tạp.
* Social features.

---

# 27. Các phiên bản tương lai

## V2

* Advanced search.
* Filter.
* Nhiều ngôn ngữ.
* Nhiều external resources.
* Cross-reference.
* Metadata phong phú hơn.

## V3

Interactive Buddhist Map:

```text
Kinh
 ↕
Bộ kinh
 ↕
Truyền thống
 ↕
Khái niệm
 ↕
Kinh liên quan
```

Thêm graph visualization.

## V4

Hệ thống đóng góp cộng đồng:

```text
GitHub Pull Request
        ↓
Data Validation
        ↓
Review
        ↓
Merge
        ↓
Automatic Deployment
```

Qua đó BuddhistMap có thể trở thành một dự án knowledge base mã nguồn mở.

---

# 28. Chiến lược phát triển

Triển khai theo thứ tự:

### Phase 1 — Foundation

1. Tạo Astro project.
2. Cấu hình TypeScript.
3. Tạo GitHub repository.
4. Cấu hình GitHub Pages.
5. Cấu hình deployment.
6. Tạo layout cơ bản.
7. Tạo global navigation.

### Phase 2 — Data Model

1. Định nghĩa entity schemas.
2. Tạo dữ liệu JSON/YAML ban đầu.
3. Implement relationships.
4. Implement validation.

### Phase 3 — Navigation

1. Homepage.
2. Trang Tradition.
3. Trang Canon.
4. Trang Collection.
5. Trang Text.
6. Breadcrumb.
7. Sidebar.

### Phase 4 — External Resources

1. Resource schema.
2. Resource components.
3. Link Đọc.
4. Link Nghe.
5. Link Tham khảo.

### Phase 5 — Search

Implement search phía client/static.

Search:

```text
title
alternative names
Pāli / Sanskrit names
identifier
keywords
```

### Phase 6 — Hoàn thiện

* Responsive design.
* Accessibility.
* SEO.
* OpenGraph metadata.
* Favicon.
* Performance.
* Error pages.

---

# 29. Tiêu chí hoàn thành

Version 1 được xem là hoàn thành khi người dùng có thể:

1. Mở BuddhistMap.
2. Hiểu được cấu trúc tổng thể.
3. Chọn một truyền thống Phật giáo.
4. Điều hướng qua cấu trúc kinh điển.
5. Chọn một bộ kinh.
6. Tìm một kinh cụ thể.
7. Xem mã định danh và các tên gọi khác.
8. Hiểu kinh đó nằm ở đâu trong hệ thống.
9. Xem các kinh/văn bản liên quan.
10. Xem các nguồn đọc/nghe bên ngoài.
11. Tìm kiếm một kinh bằng nhiều tên khác nhau.
12. Điều hướng toàn bộ website mà không cần biết trước cấu trúc hệ thống.

Website phải mang cảm giác giống:

> **Wikipedia + Library Catalog + Knowledge Map**

hơn là:

> **Một website chứa toàn bộ nội dung Kinh Phật.**

---

# 30. Triết lý sản phẩm

Mục đích cốt lõi của BuddhistMap:

> **Làm cho cấu trúc của hệ thống Kinh Phật trở nên dễ hiểu, dễ khám phá và dễ tra cứu.**

Dự án ưu tiên:

```text
Cấu trúc
    ↓
Khả năng khám phá
    ↓
Mối quan hệ
    ↓
Nguồn tham khảo
    ↓
Truy cập nội dung thông qua nguồn bên ngoài
```

Bản thân BuddhistMap nên giữ thiết kế nhẹ và đơn giản.

Mục tiêu dài hạn là trở thành một **bản đồ/chỉ mục có cấu trúc của hệ thống Kinh Phật**, trong khi các website chuyên biệt bên ngoài vẫn là nơi người dùng thực sự đọc, nghe hoặc nghiên cứu nội dung.
