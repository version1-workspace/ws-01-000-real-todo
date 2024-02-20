interface PageInfo {
  page: number;
  limit: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationParams<T> {
  list: T[];
  pageInfo: PageInfo;
}

export class Pagination<T> {
  list: T[];
  pageInfo: PageInfo;

  static create<T>(params?: PageInfo) {
    return new Pagination<T>({
      list: [],
      pageInfo: params || {
        page: 1,
        limit: 0,
        totalCount: 0,
        hasNext: false,
        hasPrevious: false,
      },
    });
  }

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
    return this.pageInfo.hasNext;
  }

  get hasPrevious() {
    return this.pageInfo.hasPrevious;
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
