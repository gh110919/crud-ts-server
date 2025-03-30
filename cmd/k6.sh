docker run -i --rm -v "$PWD:/src/test" -e K6_VUS=20 grafana/k6 run $(cwd)/src/test/get.test.js
