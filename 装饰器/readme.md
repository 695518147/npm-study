### 1.can only be default-imported using the 'esModuleInterop' flag
```
import request from 'request'报错如上

正确方式：import * as request from 'request'
```
