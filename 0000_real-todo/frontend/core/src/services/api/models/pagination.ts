interface PageInfo {
  page: number;
  limit: number;
  totalCount: number;
}

export interface PaginationParams<T> {
  list: T[];
  pageInfo: PageInfo;
}

export class Pagination<T> {
  list: T[];
  pageInfo: PageInfo;

  constructor(params: PaginationParams<T>) {
    this.list = params.list;
    this.pageInfo = params.pageInfo;
  }

  get page() {
    return this.pageInfo.page;
  }

  get total() {
    return this.pageInfo.totalCount;
  }

  get hasNext() {
    const { limit } = this.pageInfo;
    return this.total > limit * this.page;
  }

  get hasPrevious() {
    return this.page > 1;
  }

  get pageCount() {
    return Math.ceil(this.total / this.pageInfo.limit);
  }

  set(index: number, data: T) {
    const list = [...this.list];
    list[index] = data;

    return new Pagination<T>({
      list,
      pageInfo: this.pageInfo,
    });
  }
}
