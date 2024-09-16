export interface Paging {
    page_size: number,
    total_page: number,
    current_page: number
}

export interface Pageable<T> {
    data: Array<T>
    paging: Paging
}