# Thư mục `src` - Cấu trúc dự án

> Lưu ý: Mỗi khi có thay đổi (thêm, xóa, sửa) liên quan đến cây thư mục hoặc file trong thư mục `src`, hãy cập nhật lại cây thư mục trong file `readme.md` này để đảm bảo tài liệu luôn chính xác.

## Dependencies

### dependencies

```
@hookform/resolvers: ^5.1.1
@radix-ui/react-alert-dialog: ^1.1.14
@radix-ui/react-avatar: ^1.1.10
@radix-ui/react-checkbox: ^1.3.2
@radix-ui/react-collapsible: ^1.1.11
@radix-ui/react-dialog: ^1.1.14
@radix-ui/react-dropdown-menu: ^2.1.15
@radix-ui/react-label: ^2.1.7
@radix-ui/react-popover: ^1.1.14
@radix-ui/react-radio-group: ^1.3.7
@radix-ui/react-scroll-area: ^1.2.9
@radix-ui/react-select: ^2.2.5
@radix-ui/react-separator: ^1.1.7
@radix-ui/react-slot: ^1.2.3
@radix-ui/react-switch: ^1.2.5
@radix-ui/react-tabs: ^1.1.12
@radix-ui/react-tooltip: ^1.2.7
@tabler/icons-react: ^3.34.1
@tailwindcss/vite: ^4.1.11
@tanstack/react-query: ^5.83.0
axios: ^1.10.0
class-variance-authority: ^0.7.1
clsx: ^2.1.1
cmdk: ^1.1.1
date-fns: ^4.1.0
js-cookie: ^3.0.5
lucide-react: ^0.525.0
next-themes: ^0.4.6
react: ^19.1.0
react-day-picker: ^9.8.0
react-dom: ^19.1.0
react-hook-form: ^7.60.0
react-router-dom: ^7.7.0
recharts: ^3.1.0
sonner: ^2.0.6
tailwind-merge: ^3.3.1
tailwindcss: ^4.1.11
zod: ^4.0.5
```

### devDependencies

```
@eslint/js: ^9.30.1
@types/js-cookie: ^3.0.6
@types/node: ^24.0.15
@types/react: ^19.1.8
@types/react-dom: ^19.1.6
@vitejs/plugin-react-swc: ^3.10.2
eslint: ^9.30.1
eslint-plugin-react-hooks: ^5.2.0
eslint-plugin-react-refresh: ^0.4.20
globals: ^16.3.0
tw-animate-css: ^1.3.5
typescript: ~5.8.3
typescript-eslint: ^8.35.1
vite: ^7.0.4
```

## Thiết lập axios và react-query

- Đã tạo file `src/configs/instances.ts` để cấu hình axios instance, có sẵn interceptors tự động thêm Authorization token vào header và xử lý lỗi response (ví dụ: 401).
- Đã cấu hình @tanstack/react-query ở file `src/main.tsx` bằng cách bọc toàn bộ app với `QueryClientProvider`, giúp quản lý dữ liệu bất đồng bộ hiệu quả trên toàn ứng dụng.

## Cấu trúc thư mục

```
src/
├── App.css
├── App.tsx
├── index.css
├── main.tsx
├── routes.tsx
├── vite-env.d.ts
├── assets/
│   └── react.svg
├── components/
│   ├── coming-soon.tsx
│   ├── command-menu.tsx
│   ├── confirm-dialog.tsx
│   ├── learn-more.tsx
│   ├── long-text.tsx
│   ├── navigation-progress.tsx
│   ├── password-input.tsx
│   ├── profile-dropdown.tsx
│   ├── search.tsx
│   ├── select-dropdown.tsx
│   ├── skip-to-main.tsx
│   ├── theme-switch.tsx
│   └── ui/
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── popover.tsx
│       ├── radio-group.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
├── configs/
│   └── instances.ts
├── context/
│   ├── font-context.tsx
│   ├── search-context.tsx
│   └── theme-context.tsx
├── hooks/
│   └── use-mobile.ts
├── layout/
│   ├── app-sidebar.tsx
│   ├── authenticated-layout.tsx
│   ├── header.tsx
│   ├── main.tsx
│   ├── nav-group.tsx
│   ├── nav-user.tsx
│   ├── team-switcher.tsx
│   ├── top-nav.tsx
│   ├── types.ts
│   └── data/
│       └── sidebar-data.ts
├── lib/
│   └── utils.ts
└── pages/
    ├── dashboard/
    │   └── page.tsx
    └── login/
        └── page.tsx
```

> File này mô tả cấu trúc thư mục `src`, các package sử dụng và các thiết lập kỹ thuật quan trọng trong dự án để dễ dàng tham khảo và phát triển.
