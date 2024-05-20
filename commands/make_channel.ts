import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

import { stubsRoot } from '../stubs/main.js'
import StringBuilder from '@poppinss/utils/string_builder'
import string from '@poppinss/utils/string'

export default class MakeChannel extends BaseCommand {
  static commandName = 'make:channel'
  static description = 'Make a new notification channel class'
  static options: CommandOptions = {
    allowUnknownFlags: true,
  }

  /**
   * The name of the channel file.
   */
  @args.string({ description: 'Name of the notification channel' })
  declare name: string

  /**
   * Define the model for the channel
   */
  @flags.string({ description: 'The intent model for the channel', default: 'User' })
  declare model: string

  /**
   * Execute command
   */
  async run(): Promise<void> {
    const codemods = await this.createCodemods()

    const entity = this.app.generators.createEntity(this.name)
    const model = this.app.generators.createEntity(this.model)
    await codemods.makeUsingStub(stubsRoot, 'make/channel/main.stub', {
      flags: this.parsed.flags,
      channelName: channelName(entity.name),
      channelFileName: new StringBuilder(channelName(entity.name))
        .snakeCase()
        .ext('.ts')
        .toString(),
      model: model,
      modelName: this.app.generators.modelName(model.name),
      modelFileName: new StringBuilder(this.app.generators.modelName(model.name))
        .snakeCase()
        .toString(),
    })
  }
}

function channelName(name: string) {
  return new StringBuilder(name)
    .removeExtension()
    .removeSuffix('notification')
    .removeSuffix('provision')
    .pascalCase()
    .suffix(string.pascalCase('Channel'))
    .toString()
}
