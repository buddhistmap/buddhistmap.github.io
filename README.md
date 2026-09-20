# BuddhistMap

Website tra cứu cấu trúc kinh điển Phật giáo, xây dựng bằng Astro, TypeScript và JSON. Không lưu toàn văn kinh hoặc media của bên thứ ba.

## Chạy local

Yêu cầu Node.js 24 và npm.

```sh
npm ci
npm run dev
```

Mở http://127.0.0.1:4321. Kiểm tra và build:

```sh
npm run check
npm test
npm run build
npm run preview
```

## Dữ liệu

- `data/entities.json`: truyền thống, kinh điển, tạng, tuyển tập, văn bản. Mỗi mục có ID ổn định, tên đa ngôn ngữ, parent, nguồn metadata và quan hệ có mô tả.
- `data/resources.json`: nguồn đọc / nghe / xem / tham khảo, liên kết độc lập với UI.
- `src/lib/schema.ts`: schema và validation được chạy trong quá trình build. Chặn ID trùng / sai, trường thiếu, parent và quan hệ bị mất, chu trình phân cấp, resource bị mất và URL không phải HTTP(S).
- `src/lib/data.ts`: cây điều hướng, breadcrumb, route và search index từ cùng một nguồn dữ liệu.

Thêm entity vào JSON, trỏ `parent` tới ID tồn tại (hoặc `null` cho gốc), ghi `sources` và `resourceIds`. Type mới được render bằng template chung. Tên dịch không phải khóa duy nhất: giữ mã định danh và ID ổn định. Quan hệ `related` không có nghĩa là hai văn bản tương đương; cần ghi rõ trong `note`. Quan hệ có hướng, khai báo cả hai chiều khi muốn hiển thị ở hai hồ sơ.

Mọi thay đổi dữ liệu cần chạy `npm run validate` và được rà soát nội dung. URL hợp lệ về cú pháp không bảo đảm nội dung còn tồn tại; kiểm tra thủ công định kỳ tại website nguồn. Dữ liệu V1 chọn lọc, chưa đầy đủ; nguồn nghe ban đầu là thư viện chung SuttaCentral Voice, không giả lập audio riêng cho từng kinh.

## GitHub Pages

Remote có sẵn: `buddhistmap/buddhistmap.github.io`. `astro.config.mjs` dùng domain gốc tương ứng, không có base path. Workflow `.github/workflows/deploy.yml` chạy kiểm tra trên PR, build và deploy khi push vào `main`.

Trong repository GitHub, chọn **Settings → Pages → Source → GitHub Actions**, sau đó push code lên `main`. Việc triển khai lên tài khoản GitHub cần quyền truy cập repository. Thay `site`, sitemap và robots nếu chuyển domain; nếu dùng project Pages với subpath thì phải cập nhật các link gốc tương ứng.

## Phạm vi và quyết định triển khai

Đánh giá `Plan.md`: phù hợp cho V1. Bổ sung chống chu trình, nguồn metadata, kiểm thử tìm không dấu và quy định phạm vi dữ liệu. UI tiếng Việt; tên và tìm kiếm đa ngôn ngữ. Cây là đường điều hướng, không phải khẳng định các truyền thống loại trừ nhau. Tạng được hỗ trợ ngay để giữ đúng cấu trúc Pāli. Chưa triển khai tài khoản, CMS, backend hoặc graph tương tác.

Giao diện dùng CSS thuần và SVG, font Be Vietnam Pro / Noto Serif qua Google Fonts (có font dự phòng). Trang nội dung, cây và nguồn hoạt động không cần JavaScript; tìm kiếm tức thì cần JavaScript. Metadata và thông tin SEO sinh tĩnh, có sitemap và trang 404.

Nguồn đối chiếu: [SuttaCentral](https://suttacentral.net/), [CBETA](https://cbetaonline.dila.edu.tw/), [84000](https://84000.co/about/faq). Nội dung bên ngoài thuộc các đơn vị cung cấp. Việc kiểm tra cấu trúc tự động không thay thế biên tập chuyên môn.
