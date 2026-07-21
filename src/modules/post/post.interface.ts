import { Poststatus } from "../../../generated/prisma/enums";



export interface ICreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  status?: Poststatus;
  tags: string[];
}
export interface IUpdatePostPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  status?: Poststatus;
  tags?: string[];
}



export interface IPostQuery {
  searchTerm?: string;
  title?: string;
  content?: string;
  authorId?: string;
  status?: Poststatus;

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
}