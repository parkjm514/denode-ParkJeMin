import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Posting } from "../entities/posting.entity";

@Injectable()
export class PostingRepository extends Repository<Posting> {
  constructor(private dataSource: DataSource) {
    super(Posting, dataSource.createEntityManager());
  }

  async generatePosting() {}
}
