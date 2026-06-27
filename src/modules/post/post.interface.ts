import { postStatus } from "../../../generated/prisma/enums";

export interface IPostCreate {
  title: string;
  content: string;
  tumbnail?: string;
  tags: string[];
  isFeatured?: boolean;
  status?: postStatus;
}
