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