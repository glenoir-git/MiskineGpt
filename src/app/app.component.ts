import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GptTEst';

  public openai: OpenAIApi;
  public history = Array<[string, string]>();

  public frmgrp = new FormGroup({
    user_input: new FormControl('', [Validators.required]),
  });

  constructor() {
    const configuration = new Configuration({
      apiKey: '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',
    });
    this.openai = new OpenAIApi(configuration);
  }

  public async sendQuestion() {
    let messages = Array<ChatCompletionRequestMessage>();
    this.history.forEach(([input_text, completion_text]) => {
      messages.push({ role: "user", content: input_text });
      messages.push({ role: "assistant", content: completion_text });

    });

    messages.push({ role: "user", content: this.frmgrp.value.user_input! });
    let g: ChatCompletionRequestMessage;
    try {
      console.log(messages);
      const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
      if (completion.data.choices.length == 0) {
        console.log("No completion");
        return;
      }
      const completion_text = completion?.data?.choices[0]?.message?.content;
      console.log(completion_text);
      if (completion_text == null) {
        console.log("No completion");
        return;
      }
      this.history.push([this.frmgrp.value.user_input!, completion_text]);
      console.log(this.history);
    }
    catch (e) {
      console.log(e);
    }

  }


}
