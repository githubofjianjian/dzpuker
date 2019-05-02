//
// ts-msgpack (MessagePack for TypeScript)
// Copyright (C) 2016 Hack86 (Disturbed Coder)
//
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
module org.msgpack 
{

	/**
	 * The factory class is responsible for managing the workers which will encode/decode data. Each <code>MsgPack</code> instance has it own factory.<br>
	 * <strong>You shouldn't instantiate this class using operator new. Instances are created internally by <code>MsgPack</code> objects.</strong>
	 * @see MsgPack
	 */
	export class Factory 
	{
		
		flags:number;
		workers:any;
		root:Worker;

		/**
		 * @private
		 */
		constructor(flags:number)
		{
			this.flags = flags;
			this.workers = {};
		}

		/**
		 * Assign <code>workerClass</code> to the specified classes.<br>
		 * Note: all parameters must be of type <code>Class</code>.
		 * @param workerClass The worker class.
		 * @param ...args List of classes to assign the worker.
		 * @see Worker
		 * @throws org.msgpack.MsgPackError Thrown when you try to assign the worker to ordinary objects, not classes.
		 */
		assign(workerClass:any, ...args):void
		{
			for (var i:number = 0; i < args.length; i++)
			{
				// if (args[i] != null && !(args[i] is Class))
				// 	throw new MsgPackError("Workers must be assigned to classes not regular objects");

				this.workers[args[i]] = workerClass;
			}
		}

		/**
		 * Remove the worker from the class which was assigned. If the worker was assigned to several classes, you must call this method for each one.
		 * @param type The class type which the worker was assigned to.
		 * @see Worker
		 */
		unassign(type:any):void
		{
			var typeName:string = type instanceof String ? type : type.TYPE;
			this.workers[typeName] = undefined;
		}

		/**
		 * Return the worker assigned to the class of <code>data</code>. For example, if data is the value <code>1.5</code> Number class is used.
		 * @param data Data type used to find the related worker.
		 * @return Return the related worker.
		 * @throws org.msgpack.MsgPackError Thrown when no worker is assigned to the class of <code>data</code>.
		 */
		getWorkerByType(data:any):Worker
		{
			var typeName:string = data == null ? "null" : egret.getQualifiedClassName(data);

			if (!this.workers[typeName])
				throw new MsgPackError("Worker for type '" + typeName + "' not found");

			var CLS = this.workers[typeName];
			return new CLS(this);
		}

		/**
		 * Return the worker which is capable of decoding the next byte of the input stream.
		 * @param source Input stream.
		 * @return Return the related worker.%
		 * @throws org.msgpack.MsgPackError Thrown when no worker is capable of decode the next byte of the input stream.
		 */
		getWorkerByByte(source:egret.ByteArray):Worker
		{
			var byte:number = source.readByte() & 0xff;

			for (var workerClassKey in this.workers)
			{
				var workerClass = this.workers[workerClassKey]; 
				if (!workerClass["checkType"](byte))
					continue;

				return new workerClass(this, byte);
			}

			throw new MsgPackError("Worker for signature 0x" + byte.toString(16) + " not found");
		}

		/**
		 * Check if the flag is <code>true</code>.
		 * @param f Flag value.
		 * @return True or flase.
		 * @see MsgPackFlags#ACCEPT_LITTLE_ENDIAN
		 * @see MsgPackFlags#READ_RAW_AS_BYTE_ARRAY
		 */
		checkFlag(f:number):Boolean
		{
			return (f & this.flags) != 0;
		}
	}
}