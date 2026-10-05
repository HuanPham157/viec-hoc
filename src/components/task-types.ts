export type Task = {
  id: string;
  title: string;
  is_done: boolean;
};

export type TaskFilter = "all" | "pending" | "done";

export const initialTasks: Task[] = [
  {
    id: "physics-report",
    title: "Nộp báo cáo Thí nghiệm Vật lý đại cương",
    is_done: false,
  },
  {
    id: "calculus-slides",
    title: "Đọc trước Slide Giải tích 2: Tích phân đường và mặt",
    is_done: false,
  },
  {
    id: "programming-group",
    title: "Lập nhóm thảo luận bài tập lớn Kỹ thuật lập trình",
    is_done: false,
  },
  {
    id: "english-vocabulary",
    title: "Ôn từ vựng tiếng Anh IELTS Unit 4",
    is_done: true,
  },
  {
    id: "statistics-quiz",
    title: "Giải 5 câu trắc nghiệm Xác suất thống kê phần Biến ngẫu nhiên",
    is_done: true,
  },
];
