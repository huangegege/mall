export class PaginationVo<T> {
  data: T[];
  pageNum: number;
  pageSize: number;
  pages: number;
  total: number;

  constructor(data: T[], pageNum: number, pageSize: number, total: number) {
    this.data = data;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.total = total;
    this.pages = Math.ceil(total / pageSize);
  }
}
