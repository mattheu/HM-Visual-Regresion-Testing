const STATUS = {
	READY: 'ready',
	RUNNING: 'running',
	DONE: 'done',
}

class Task {
	constructor( callback, args ) {
		this.status = STATUS.READY;
		this.callback = callback;
		this.args = args;
		this.result = null;
	}

	async run() {
		this.status = STATUS.RUNNING;
		const result = await this.callback.apply( null, this.args );
		this.result = result;
		this.status = STATUS.DONE;
	}
}

class Queue {
	constructor( { concurrent = 5, delay = 250 } ) {
		this.concurrent = concurrent;
		this.delay = delay;
		this.tasks = [];
	}

	addTask( callback, args ) {
		this.tasks.push( new Task( callback, args ) );
	}

	getNextTask() {
		return this.tasks.find( task => task.status === STATUS.READY );
	}

	canPickUpTask() {
		return this.tasks.filter( task => task.status === STATUS.RUNNING ).length < this.concurrent;
	}

	isDone() {
		return this.tasks.filter( task => task.status !== STATUS.DONE ).length === 0;
	}

	async maybeDoNextTask() {
		if ( ! this.canPickUpTask() ) {
			return;
		}

		const task = this.getNextTask();
		task && await task.run();
	}

	/**
	 * Run all items in the queue.
	 */
	async run() {
		return new Promise( resolve => {
			const interval = setInterval( async () => {
				await this.maybeDoNextTask();

				if ( this.isDone() ) {
					clearInterval( interval );
					resolve();
				}
			}, this.delay );
		} );
	}
}

module.exports = Queue;
