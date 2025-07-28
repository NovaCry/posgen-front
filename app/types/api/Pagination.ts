export default interface Pagination<T> {
  data: T[];
  meta: {
    page: number;
    maxItems: number;
    totalCount: number;
    totalPages: number;
  };
}
