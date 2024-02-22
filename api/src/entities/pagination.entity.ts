const SortOrder = {
  asc: 'asc',
  desc: 'desc',
};

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams<T, K> {
  data: T[];
  sortType: K;
  sortOrder: SortOrder;
  limit: number;
  page: number;
  totalCount: number;
}

export class Pagination<T, K> {
  private readonly _params: PaginationParams<T, K>;
  constructor(params: PaginationParams<T, K>) {
    this._params = params;
  }

  get serialize() {
    const { data, limit, page, sortOrder, sortType, totalCount } = this._params;
    return {
      data,
      pageInfo: {
        page: Number(page),
        limit: Number(limit),
        sortOrder,
        sortType,
        hasNext: totalCount > limit * page,
        hasPrevious: Number(page) > 1,
        totalCount: Number(totalCount),
      },
    };
  }
}
