import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectID } from 'mongodb';
import { MessageData } from './message.data';
import { ChatMessageModel, ChatMessageSchema } from './models/message.model';

import { ConfigManagerModule } from '../configuration/configuration-manager.module';
import { getTestConfiguration } from '../configuration/configuration-manager.utils';

const id = new ObjectID('5fe0cce861c8ea54018385af');
const conversationId = new ObjectID();
const senderId = new ObjectID('5fe0cce861c8ea54018385af');
const sender2Id = new ObjectID('5fe0cce861c8ea54018385aa');
const sender3Id = new ObjectID('5fe0cce861c8ea54018385ab');

class TestMessageData extends MessageData {
  async deleteMany() {
    await this.chatMessageModel.deleteMany();
  }
}

describe('MessageData', () => {
  let messageData: TestMessageData;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigManagerModule],
          useFactory: () => {
            const databaseConfig = getTestConfiguration().database;
            return {
              uri: databaseConfig.connectionString,
            };
          },
        }),
        MongooseModule.forFeature([
          { name: ChatMessageModel.name, schema: ChatMessageSchema },
        ]),
      ],
      providers: [TestMessageData],
    }).compile();

    messageData = module.get<TestMessageData>(TestMessageData);
  });

  beforeEach(async () => {
    messageData.deleteMany();
  });

  afterEach(async () => {
    messageData.deleteMany();
  });

  it('should be defined', () => {
    expect(messageData).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(messageData.create).toBeDefined();
    });

    it('successfully creates a message', async () => {
      const conversationId = new ObjectID();
      const message = await messageData.create(
        { conversationId, text: 'Hello world' },
        senderId,
      );

      expect(message).toMatchObject({
        likes: [],
        resolved: false,
        deleted: false,
        reactions: [],
        text: 'Hello world',
        senderId: senderId,
        conversationId: conversationId,
        conversation: { id: conversationId.toHexString() },
        likesCount: 0,
        sender: { id: senderId.toHexString() },
      });
    });
  });

  describe('get', () => {
    it('should be defined', () => {
      expect(messageData.getMessage).toBeDefined();
    });

    it('successfully gets a message', async () => {
      const conversationId = new ObjectID();
      const sentMessage = await messageData.create(
        { conversationId, text: 'Hello world' },
        senderId,
      );

      const gotMessage = await messageData.getMessage(
        sentMessage.id.toHexString(),
      );

      expect(gotMessage).toMatchObject(sentMessage);
    });
  });

  describe('delete', () => {
    it('successfully marks a message as deleted', async () => {
      const conversationId = new ObjectID();
      const message = await messageData.create(
        { conversationId, text: 'Message to delete' },
        senderId,
      );

      // Make sure that it started off as not deleted
      expect(message.deleted).toEqual(false);

      const deletedMessage = await messageData.delete(new ObjectID(message.id));
      expect(deletedMessage.deleted).toEqual(true);

      // And that is it now deleted
      const retrievedMessage = await messageData.getMessage(message.id.toHexString())
      expect(retrievedMessage.deleted).toEqual(true);
    });
  });

  describe('update tags', () => {
    it('successfully updates tags on a message', async () => {
      const conversationId = new ObjectID();
      const message = await messageData.create(
        {
          conversationId,
          text: 'Message to update tags',
        },
        senderId,
      );

      expect(message.tags).toBeTruthy();
      expect(message.tags?.length).toEqual(0);

      const tags = ['courses', 'computer science'];

      const updatedMessage = await messageData.updateTags(
        new ObjectID(message.id),
        tags,
      );

      // check that the tags of the message was updated
      expect(updatedMessage.tags).toBeDefined();
      expect(updatedMessage.tags?.length).toEqual(2);
      expect(updatedMessage.tags).toContain('courses');
      expect(updatedMessage.tags).toContain('computer science');

    });
  });

  describe('find message with tags', () => {
    it('successfully finds message with tags', async () => {
      const conversationId = new ObjectID();

      // create first message with tags
      const message = await messageData.create(
        {
          conversationId,
          text: 'Message to find with tags tags',
        },
        senderId,
      );

      await messageData.updateTags(new ObjectID(message.id), [
        'courses',
        'alumni',
      ]);

      //create second message with tags.
      const message2 = await messageData.create(
        {
          conversationId,
          text: 'Message to find with tags tags',
        },
        senderId,
      );

      await messageData.updateTags(new ObjectID(message2.id), [
        'courses',
        'graduate',
      ]);

      const messages = await messageData.findMessagesByTags(['courses']);

      expect(messages.length).toEqual(2);
    });
  });
});
