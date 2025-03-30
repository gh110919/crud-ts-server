import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // 20 пользователей за 30 секунд
    { duration: "1m", target: 50 }, // 50 пользователей за 1 минуту
    { duration: "30s", target: 0 }, // Снижение нагрузки до 0
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% запросов должны быть быстрее 500 мс
  },
};

export default function () {
  const res = http.get("https://test-api.example.com/users");
  check(res, {
    "Status is 200": (r) => r.status === 200,
    "Response time < 500ms": (r) => r.timings.duration < 500,
  });
  sleep(1); // Пауза между запросами
}
