/* @flow */
export type CountOptionsType = {
  limit?: number;
  skip?: number
};

import type {
  //AsyncAction, AsyncAction1, AsyncAction2, AsyncAction3, AsyncAction4, AsyncAction5, AsyncAction6,
  AsyncFunc, AsyncFunc1, AsyncFunc2, AsyncFunc3, AsyncFunc4, AsyncFunc5, AsyncFunc6
} from 'nodefunc-promisify';

import promisify from 'nodefunc-promisify';
import Cursor from "./cursor";
import MongoDb from "mongodb";

const _count: AsyncFunc2<Object, CountOptionsType, number> = promisify(MongoDb.Collection.prototype.count);
const _createIndex: AsyncFunc1<Object, void> = promisify(MongoDb.Collection.prototype.createIndex);
const _deleteOne: AsyncFunc1<Object, void> = promisify(MongoDb.Collection.prototype.deleteOne);
const _deleteMany: AsyncFunc1<Object, { result: { n: number } }> = promisify(MongoDb.Collection.prototype.deleteMany);
const _drop: AsyncFunc<void> = promisify(MongoDb.Collection.prototype.drop);
const _dropIndexes: AsyncFunc<void> = promisify(MongoDb.Collection.prototype.dropIndexes);
const _dropIndex: AsyncFunc1<string, void> = promisify(MongoDb.Collection.prototype.dropIndex);
const _find = MongoDb.Collection.prototype.find;
const _indexes: AsyncFunc<Array<Object>> = promisify(MongoDb.Collection.prototype.indexes);
const _insertOne: AsyncFunc1<Object, { insertedId: string }> = promisify(MongoDb.Collection.prototype.insertOne);
const _insertMany: AsyncFunc1<Array<Object>, { insertedIds: Array<string> }> = promisify(MongoDb.Collection.prototype.insertMany);
const _updateOne: AsyncFunc2<Object, Object, void> = promisify(MongoDb.Collection.prototype.updateOne);
const _updateMany: AsyncFunc2<Object, Object, { result: { n: number } }> = promisify(MongoDb.Collection.prototype.updateMany);

class Collection {
  underlying: MongoDb.Collection;

  constructor(underlying: MongoDb.Collection) {
    this.underlying = underlying;
  }

  async count(query: Object, options: CountOptionsType = {}) : Promise<number> {
    const { limit, skip } = options;
    return await _count.call(this.underlying, query, { limit, skip });
  }

  async createIndex(field: Object) : Promise<void> {
    await _createIndex.call(this.underlying, field);
  }

  async deleteOne(filter: Object) : Promise<void> {
    await _deleteOne.call(this.underlying, filter);
  }

  async deleteMany(filter: Object) : Promise<number> {
    const { result: { n } } = await _deleteMany.call(this.underlying, filter);
    return n;
  }

  async dropIndex(name: string) : Promise<void> {
    await _dropIndex.call(this.underlying, name);
  }

  async drop() : Promise<Collection> {
    await _drop.call(this.underlying);
    return this;
  }

  async dropIndexes() : Promise<void> {
    await _dropIndexes.call(this.underlying);
  }

  find(query: Object, fields?: Object) : Cursor {
    const cursor = _find.call(this.underlying, query, fields);
    return new Cursor(cursor);
  }

  async indexes(indexes: Object) : Promise<Array<Object>> {
    return await _indexes.call(this.underlying);
  }

  async insertOne(doc: Object) : Promise<string> {
    const { insertedId } = await _insertOne.call(this.underlying, doc);
    return insertedId;
  }

  async insertMany(docs: Array<Object>) : Promise<Array<string>> {
    const { insertedIds } = await _insertMany.call(this.underlying, docs);
    return insertedIds.map(id => id.toString());
  }

  async updateOne(selector: Object, update: Object) : Promise<void> {
    await _updateOne.call(this.underlying, selector, update);
  }

  async updateMany(selector: Object, update: Object) : Promise<number> {
    const { result: { n } } = await _updateMany.call(this.underlying, selector, update);
    return n;
  }
}


export default Collection;
