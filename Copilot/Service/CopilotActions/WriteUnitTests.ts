import CopilotActionType from "Common/Types/Copilot/CopilotActionType";
import CopilotActionBase, {
  CopilotActionPrompt,
  PromptRole,
} from "./CopilotActionsBase";
import CodeRepositoryUtil from "../../Utils/CodeRepository";

export default class WriteUnitTests extends CopilotActionBase {
  public constructor() {
    super();
    this.copilotActionType = CopilotActionType.WRITE_UNIT_TESTS;
    this.acceptFileExtentions = CodeRepositoryUtil.getCodeFileExtentions();
  }

  public override async getPrompt(): Promise<CopilotActionPrompt> {
    const prompt: string = `Write unit tests for this file.
    
    Here is the code. This is in {{fileLanguage}}: 
    
    {{code}}
                `;

    const systemPrompt: string = `You are an expert programmer. Here are your instructions:
- You will follow the instructions given by the user strictly.
- You will not deviate from the instructions given by the user.
- You will not change the code unnecessarily. For example you will not change the logic, quotes around strings, or functionality.`;

    return {
      messages: [
        {
          content: systemPrompt,
          role: PromptRole.System,
        },
        {
          content: prompt,
          role: PromptRole.User,
        },
      ],
    };
  }
}
