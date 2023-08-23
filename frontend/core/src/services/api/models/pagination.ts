interface PageInfo {
  page: number;
  per: number;
  total: number;
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

  get hasNext() {
    const { per, page } = this.pageInfo;
    return this.pageInfo.total > per * page;
  }

  get hasPrevious() {
    return this.pageInfo.page > 1;
  }

  get pageCount() {
    return Math.ceil(this.pageInfo.total / this.pageInfo.per);
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
