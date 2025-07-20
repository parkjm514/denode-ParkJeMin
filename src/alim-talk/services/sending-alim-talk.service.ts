import { AlimTalkLogService } from "./alim-talk-log.service";
import { Injectable } from "@nestjs/common";
import { SendingAlimTalkDto } from "../dtos/sending-alim-talk.dto";
import { GenerateAlimTalkLogDto } from "../dtos/generate-alim-talk-log.dto";

@Injectable()
export class SendingAlimTalkService {
  constructor(private alimTalkLogService: AlimTalkLogService) {}

  async sendAlimTalk(sendingAlimTalkDto: SendingAlimTalkDto) {
    const { alimTalkTitle, alimTalkContent } = sendingAlimTalkDto;

    try {
      //TODO: 실제로 알림톡 연결 가능하면 axios.post 해서 알림톡 연결 후 결과 값 로그 생성
      const generateAlimTalkLogDto: GenerateAlimTalkLogDto = {
        alimTalkTitleLog: alimTalkTitle,
        alimTalkContentLog: alimTalkContent,
        isSendingSuccess: true,
      };
      await this.alimTalkLogService.generateAlimTalkLog(generateAlimTalkLogDto);
    } catch (e) {
      const generateAlimTalkLogDto: GenerateAlimTalkLogDto = {
        alimTalkTitleLog: alimTalkTitle,
        alimTalkContentLog: alimTalkContent,
        isSendingSuccess: false,
      };
      await this.alimTalkLogService.generateAlimTalkLog(generateAlimTalkLogDto);

      //TODO: 알림톡 전송 실패시 로그 생성
    }
  }
}
