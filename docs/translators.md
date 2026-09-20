# Dịch giả: dữ liệu và đối chiếu

`data/translators.json` lưu hồ sơ dịch giả và từng ghi nhận tác phẩm (`works`). Mỗi ghi nhận phải có entity đích, vai trò, ngôn ngữ, nhóm và nguồn. Hồ sơ kinh, trang dịch giả, tìm kiếm và Map đều dùng chung những ghi nhận này; không duy trì hai danh sách ngược độc lập.

## Quy ước

- `translation`: dịch sang ngôn ngữ ghi trong `language`. Một văn bản có thể có cả người dịch sang Hán và người dịch sang Việt; không gộp hai vai trò thành tác giả văn bản.
- `authorship`: trước tác / thuật ký, không cộng vào số mục dịch thuật.
- `volumes` trên entity là số quyển của Hán bản trong kinh lục; không phải số tập của ấn bản Việt.
- `historicalSummary` là thông tin thư mục có dẫn nguồn, tách với số mục hiện đã lập chỉ mục.
- Danh sách có thể gồm bộ và bài kinh con. Số dòng không phải số tác phẩm độc lập, tổng quyển không được tính bằng cách cộng mọi dòng.
- “Hán truyền” chỉ truyền thống dịch thuật. Cưu Ma La Thập xuất thân Quy Tư, không được gán quốc tịch Trung Quốc hiện đại.

## Huyền Trang

Đối chiếu metadata tên Hán, mã và số quyển với [DILA — kinh lục theo dịch giả Huyền Trang](https://authority-dev.dila.edu.tw/catalog/search.php?editor=A000294). Chỉ lấy dữ kiện thư mục, không tải hay lưu toàn văn kinh. Các ghi nhận có thêm liên kết đọc CBETA. Nhan đề Hán–Việt được biên soạn để tra cứu.

[Thư viện Đại học Bắc Kinh giới thiệu Huyền Trang toàn tập](https://lib.phil.pku.edu.cn/node/56906) ghi nhận 75 bộ kinh luận, tách Đại Đường Tây Vực Ký là tác phẩm khẩu thuật. Trong website, 75 mục dịch thuật bao gồm Hội Kim Cương nằm trong T 220; đây không phải phép khẳng định có 75 bộ hiện đại không giao nhau. Tây Vực Ký có vai trò thuật ký và được liệt kê riêng.

Các chỉnh lý quan trọng so với danh sách đề xuất:

- Chư Phật Tâm Đà-la-ni chỉ có một mục T 918.
- Thuận Chánh Lý Luận T 1562 có 80 quyển, không phải 40.
- Đại Bồ Tát Tạng Hội là hội 12 của T 310, 20 quyển (35–54); không phải Đại Thừa Bồ Tát Tạng Chánh Pháp Kinh T 316, 40 quyển.
- Kim Cương của Huyền Trang được dẫn tới T 220, hội 9, quyển 577. T 235 thuộc bản Cưu Ma La Thập; không trộn hai bản dịch.
- Chưởng Trân Luận T 1578 được phân biệt với Chưởng Trung Luận.
- Bạt Tế Khổ Nạn Đà-la-ni có mã T 1395 theo DILA; không dùng mã T 1396 từ một danh sách thứ cấp.
- Không nhập tự động các mục chưa có chứng cứ quy thuộc trong nguồn đã đối chiếu, như Lăng-già, Bảo Tính Luận hoặc Quảng Ngũ Uẩn Luận, vào danh sách dịch phẩm Huyền Trang.

Danh mục Cưu Ma La Thập và các vị Việt Nam là chọn lọc. Mỗi tác phẩm có nguồn riêng. Tuệ Sỹ được ghi dịch và hiệu chú Trường A-hàm / Trung A-hàm; không gán việc dịch những bộ chỉ có vai trò hiệu chú cho ngài.

## Giao diện và kiểm tra

- `/translators/`: tìm không dấu và lọc Việt Nam / Hán truyền; không có JavaScript vẫn xem đủ danh mục.
- `/translators/[id]/`: nhóm tác phẩm, mã, số quyển, nguồn, link hồ sơ và Map.
- `/map/?translator=[id]`: giữ các tác phẩm, hậu duệ của bộ đã dịch và đường tổ tiên. Đây là bộ lọc điều hướng, không thay đổi cây kinh điển.
- `/map/#node-[id]`: dẫn tới mục và làm nổi bật, hoạt động cả khi không có JavaScript vì cây được render mở sẵn.
- `npm test`: kiểm tra nguồn, entity đích, trùng ghi nhận, vai trò / ngôn ngữ và tính liên thông của bộ lọc Map.
- `npm run build`: kiểm tra cả file đích lẫn fragment của liên kết nội bộ.
