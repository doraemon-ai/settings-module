import { ActionInfoType, ActionHandleResultType, SYS_ACTION_NAME, SysViewElementInfo, FeedbackInfoType } from '../Interface'
import { gid } from '../index'

const md5 = require('js-md5')

class Controller {

  constructor() {
    console.log('gid',gid)
  }

  public handleFeedback(feedbackInfo: FeedbackInfoType) {
  }

  public async handleAction({ action, expectation, values }: ActionInfoType): Promise<ActionHandleResultType> {
    console.log('handle action:', action, expectation, values)

    switch (action) {
      case SYS_ACTION_NAME.INITIALIZATION:
      case 'RE_INPUT':
        return {
          sessionUUId: 'id:' + Math.random(),
          viewElementInfos: [new SysViewElementInfo.ChatBox({ placeholder: 'please input some text' }, 'exp')],
          canFeedback: false,
        }
      case SYS_ACTION_NAME.CHAT_BOX_SUBMIT:
        return {
          sessionUUId: 'id:' + Math.random(),
          viewElementInfos: [{ viewType: 'md5Text', data: { md5Str: md5(values.text) } }],
          suggestActions: [{ label: '再次输入', actionInfo: { action: 'RE_INPUT' } }],
        }
      default:
        return { sessionUUId: '', viewElementInfos: [] }
    }
  }
}

export default new Controller()
