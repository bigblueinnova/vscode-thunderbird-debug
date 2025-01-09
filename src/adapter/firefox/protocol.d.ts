declare namespace FirefoxDebugProtocol {

	interface Request {
		to: string;
		type: string;
	}

	interface Response {
		[key: string]: any;
		from: string;
	}

	interface Event extends Response {
		type: string;
	}

	interface TypedResponse extends Response {
		type: string;
	}

	interface ErrorResponse extends Response {
		error: string;
		message: string;
	}

	interface RequestTypesResponse extends Response {
		requestTypes: string[];
	}

	interface InitialResponse extends Response {
		applicationType: string;
		traits: {
			breakpointWhileRunning?: boolean,
			nativeLogpoints?: boolean,
			watchpoints?: boolean,
			webExtensionAddonConnect?: boolean,
			noPauseOnThreadActorAttach?: boolean
		};
	}

	interface RootResponse extends Response {
		preferenceActor: string;
		addonsActor?: string;
		deviceActor: string;
	}

	interface TabsResponse extends Response {
		tabs: (Tab | TabDescriptor)[];
	}

	interface Tab {
		actor: string;
		title: string;
		url: string;
		consoleActor: string;
		threadActor?: string;
	}

	interface TabDescriptor {
		actor: string;
	}

	interface TabDescriptorTargetResponse extends Response {
		frame: Tab;
	}

	interface AddonsResponse extends Response {
		addons: Addon[];
	}

	interface Addon {
		actor: string;
		id: string;
		name: string;
		isWebExtension?: boolean;
		url: string;
		consoleActor?: string;
		iconURL?: string;
		debuggable?: boolean;
		temporarilyInstalled?: boolean;
		traits?: {
			highlightable: boolean;
			networkMonitor: boolean;
		}
	}

	interface InstallAddonResponse extends Response {
		addon: {
			id: string,
			actor: boolean
		};
	}

	interface GetTargetResponse extends Response {
		form: {
			actor: string;
			url: string;
			consoleActor: string;
			threadActor: string;
		}
	}

	interface DeviceDescriptionResponse extends Response {
		value: DeviceDescription;
	}

	interface DeviceDescription {
		profile: string;
		channel: string;
	}

	interface TabAttachedResponse extends TypedResponse {
		threadActor: string;
	}

	interface TabWillNavigateResponse extends TypedResponse {
		state: string;
		url: string;
	}

	interface TabDidNavigateResponse extends TypedResponse {
		state: string;
		url: string;
		title: string;
	}

	interface FramesDestroyedResponse extends TypedResponse {
		destroyAll: true;
	}

	interface FrameUpdateResponse extends TypedResponse {
		frames: {
			id: string;
			parentID?: string;
			url: string;
			title: string;
		}[];
	}

	interface WorkersResponse extends Response {
		workers: Worker[];
	}

	interface Worker {
		actor: string;
		url: string;
		type: number;
	}

	interface WorkerAttachedResponse extends TypedResponse {
		url: string;
	}

	interface WorkerConnectedResponse extends TypedResponse {
		threadActor: string;
		consoleActor: string;
	}

	interface LegacyGetCachedMessagesResponse extends Response {
		messages: LegacyCachedMessage[];
	}

	type LegacyCachedMessage =
		(ConsoleAPICallResponseBody & { _type: 'ConsoleAPI' }) |
		(PageErrorResponseBody & { _type: 'PageError' });

	interface GetCachedMessagesResponse extends Response {
		messages: CachedMessage[];
	}

	type CachedMessage =
		{ type: 'consoleAPICall', message: ConsoleAPICallResponseBody } |
		{ type: 'pageError', pageError: PageErrorResponseBody };

	interface PageErrorResponse extends TypedResponse {
		pageError: PageErrorResponseBody;
	}

	interface PageErrorResponseBody {
		errorMessage: string;
		sourceName: string;
		lineText: string;
		lineNumber: number;
		columnNumber: number;
		category: string;
		timeStamp: number;
		info: boolean;
		warning: boolean;
		error: boolean;
		exception: boolean;
		strict: boolean;
		private: boolean;
		stacktrace: {
			filename: string;
			functionname: string;
			line: number;
			column: number;
		}[] | null;
	}

	interface ConsoleAPICallResponse extends TypedResponse {
		message: ConsoleAPICallResponseBody;
	}

	interface ConsoleAPICallResponseBody {
		arguments: Grip[];
		filename: string;
		functionName: string;
		groupName: string;
		lineNumber: number;
		columnNumber: number;
		category: string;
		timeStamp: number;
		level: string;
		workerType: string;
		private: boolean;
		styles: any[]; //?
		counter: any; //?
		timer: any; //?
	}

	interface ConsoleMessage {
		arguments: Grip[];
		filename: string;
		level: string;
		lineNumber: number;
		columnNumber: number;
		timeStamp: number;
		timer: any; //?
		// sourceId, innerWindowID
	}

	interface LogMessageResponse extends TypedResponse {
		message: string;
		timeStamp: number;
	}

	interface ResultIDResponse extends Response {
		resultID: string;
	}

	interface EvaluationResultResponse extends TypedResponse {
		input: string;
		resultID: string;
		result: Grip;
		exception?: Grip | null;
		exceptionMessage?: string;
		exceptionDocURL?: string;
		timestamp: number;
		helperResult: any; //?
	}

	interface AutoCompleteResponse extends Response {
		matches: string[];
		matchProp: string;
	}

	interface ThreadPausedResponse extends TypedResponse {
		actor: string;
		frame: Frame;
		poppedFrames: Frame[];
		why: ThreadPausedReason;
	}

	interface ThreadPausedReason {
		type: 'attached' | 'interrupted' | 'resumeLimit' | 'debuggerStatement' | 'breakpoint' | 'watchpoint' |
			'getWatchpoint' | 'setWatchpoint' | 'clientEvaluated' | 'pauseOnDOMEvents' | 'alreadyPaused' | 'exception';
		frameFinished?: CompletionValue; // if type is 'resumeLimit' or 'clientEvaluated'
		exception?: Grip; // if type is 'exception'
		actors?: string[]; // if type is 'breakpoint' or 'watchpoint'
	}

	interface GetBreakableLinesResponse extends Response {
		lines: number[];
	}

	interface GetBreakpointPositionsCompressedResponse extends Response {
		positions: BreakpointPositions;
	}

	interface BreakpointPositions {
		[line: string]: number[];
	}

	interface SourceResponse extends Response {
		source: Grip;
	}

	interface SetBreakpointResponse extends Response {
		actor: string;
		isPending: boolean;
		actualLocation?: SourceLocation;
	}

	interface PrototypeAndPropertiesResponse extends TypedResponse {
		prototype: ObjectGrip | { type: 'null' };
		ownProperties: PropertyDescriptors;
		safeGetterValues?: SafeGetterValueDescriptors;
		ownSymbols?: NamedPropertyDescriptor[];
	}

	interface GetWatcherResponse extends Response {
		actor: string;
		traits: {
			content_script?: boolean;
		};
	}

	interface GetBreakpointListResponse extends Response {
		breakpointList: {
			actor: string;
		};
	}

	interface GetThreadConfigurationResponse extends Response {
		configuration: {
			actor: string;
		};
	}

	interface ThreadConfiguration {
		shouldPauseOnDebuggerStatement: boolean;
		pauseOnExceptions: boolean;
		ignoreCaughtExceptions: boolean;
		shouldIncludeSavedFrames: boolean;
		shouldIncludeAsyncLiveFrames: boolean;
		skipBreakpoints: boolean;
		logEventBreakpoints: boolean;
		observeAsmJS: boolean;
		pauseOverlay: boolean;
	}

	interface GetAvailableEventBreakpointsResponse extends Response {
		value: AvailableEventCategory[];
	}

	interface AvailableEventCategory {
		name: string;
		events: AvailableEvent[];
	}

	interface AvailableEvent {
		id: string;
		name: string;
		type: 'simple' | 'event' | 'script';
		eventType?: string;
		notificationType?: string;
		targetTypes?: ('global' | 'node' | 'websocket' | 'worker' | 'xhr')[];
	}

	interface TargetAvailableEvent extends Event {
		target: {
			url?: string;
			actor: string;
			consoleActor: string;
			threadActor: string;
			isTopLevelTarget?: boolean;
			isFallbackExtensionDocument?: boolean;
		};
	}

	interface TargetDestroyedEvent extends Event {
		type: 'target-destroyed-form';
		target: {
			actor: string;
		};
	}

	interface DescriptorDestroyedEvent extends Event {
		type: 'descriptor-destroyed';
	}
	
	interface ThreadState {
		state: 'paused' | 'resumed';
		frame?: Frame;
		why?: ThreadPausedReason;
	}

	interface CompletionValue {
		return?: Grip;
		throw?: Grip;
		terminated?: boolean;
	}

	interface Frame {
		type: 'global' | 'call' | 'eval' | 'clientEvaluate' | 'wasmcall';
		actor: string;
		depth: number;
		this?: Grip;
		where: SourceLocation;
		environment?: Environment;
	}

	interface GlobalFrame extends Frame {
		source: Source;
	}

	interface CallFrame extends Frame {
		displayName?: string;
		arguments: Grip[];
	}

	interface EvalFrame extends Frame {
	}

	interface ClientEvalFrame extends Frame {
	}

	interface SourceLocation {
		actor: string;
		line?: number;
		column?: number;
	}

	interface Source {
		actor: string;
		url: string | null;
		introductionType?: 'scriptElement' | 'eval' | 'Function' | 'debugger eval' | 'wasm' | null;
		introductionUrl: string | null;
		isBlackBoxed: boolean;
		isPrettyPrinted: boolean;
		isSourceMapped: boolean;
		generatedUrl: string | null;
		sourceMapURL: string | null;
		addonID?: string;
		addonPath?: string;
	}

	interface SourceResource extends Source {
		resourceType: 'source';
	}

	interface ConsoleMessageResource {
		resourceType: 'console-message';
		message: ConsoleMessage;
	}

	interface ErrorMessageResource {
		resourceType: 'error-message';
		pageError: PageError;
	}

	interface ThreadStateResource extends ThreadState {
		resourceType: 'thread-state';
	}

	interface ResourceAvailableForm extends Event {
		type: 'resource-available-form';
		resources: (SourceResource | ConsoleMessageResource | ErrorMessageResource | ThreadStateResource)[];
	}

	type Sources = ['source', Source[]];
	type ConsoleMessages = ['console-message', ConsoleMessage[]];
	type ErrorMessages = ['error-message', PageError[]];
	type ThreadStates = ['thread-state', ThreadState[]];
	type Resources = (Sources | ConsoleMessages | ErrorMessages | ThreadStates)[];

	interface ResourcesAvailableEvent extends Event {
		type: 'resources-available-array';
		array: Resources;
	}

	interface FrameUpdateEvent extends Event {
		type: 'frameUpdate';
	}

	interface PageError {
		errorMessage: string;
		sourceName: string;
		lineText: string;
		lineNumber: number;
		columnNumber: number;
		category: string;
		timeStamp: number;
		info: boolean;
		warning: boolean;
		error: boolean;
		exception: boolean;
		strict: boolean;
		private: boolean;
		stacktrace: {
			filename: string;
			functionname: string;
			line: number;
			column: number;
		}[] | null;
	}
	
	interface Environment {
		type?: 'object' | 'function' | 'with' | 'block';
		actor?: string;
		parent?: Environment;
	}

	interface ObjectEnvironment extends Environment {
		object: Grip;
	}

	interface FunctionEnvironment extends Environment {
		function: {
			displayName: string;
		};
		bindings: FunctionBindings;
	}

	interface WithEnvironment extends Environment {
		object: Grip;
	}

	interface BlockEnvironment extends Environment {
		bindings: Bindings;
	}

	interface Bindings {
		variables: PropertyDescriptors;
	}

	interface FunctionBindings extends Bindings {
		arguments: PropertyDescriptors[];
	}

	interface PropertyDescriptor {
		enumerable: boolean;
		configurable: boolean;
	}

	interface DataPropertyDescriptor extends PropertyDescriptor {
		value: Grip;
		writable: boolean;
	}

	interface AccessorPropertyDescriptor extends PropertyDescriptor {
		get: Grip;
		set: Grip;
	}

	interface SafeGetterValueDescriptor {
		getterValue: Grip;
		getterPrototypeLevel: number;
		enumerable: boolean;
		writable: boolean;
	}

	interface PropertyDescriptors {
		[name: string]: PropertyDescriptor;
	}

	interface SafeGetterValueDescriptors {
		[name: string]: SafeGetterValueDescriptor;
	}

	interface NamedPropertyDescriptor {
		name: string;
		descriptor: PropertyDescriptor;
	}

	interface NamedDataPropertyDescriptor {
		name: string;
		descriptor: DataPropertyDescriptor;
	}

	type Grip = boolean | number | string | ComplexGrip;

	interface ComplexGrip {
		type: 'null' | 'undefined' | 'Infinity' | '-Infinity' | 'NaN' | '-0' | 'BigInt' | 'longString' | 'symbol' | 'object';
	}

	interface ObjectGrip extends ComplexGrip {
		type: 'object';
		class: string;
		actor: string;
		preview?: Preview;
	}

	type Preview = ObjectPreview | DatePreview | ObjectWithURLPreview | DOMNodePreview |
		DOMEventPreview | ArrayLikePreview | ErrorPreview;

	interface ObjectPreview {
		kind: 'Object';
		ownProperties: { [name: string]: PropertyPreview };
		ownPropertiesLength: number;
		ownSymbols?: NamedDataPropertyDescriptor[];
		ownSymbolsLength?: number;
		safeGetterValues?: { [name: string]: SafeGetterValuePreview };
	}

	interface PropertyPreview {
		configurable: boolean;
		enumerable: boolean;
		writable?: boolean;
		value?: Grip;
		get?: FunctionGrip;
		set?: FunctionGrip;
	}

	interface DatePreview {
		kind: undefined;
		timestamp: number;
	}

	interface ObjectWithURLPreview {
		kind: 'ObjectWithURL';
		url: string;
	}

	interface DOMNodePreview {
		kind: 'DOMNode';
		nodeType: number;
		nodeName: string;
		isConnected: boolean;
		location?: string;
		attributes?: { [name: string]: string };
		attributesLength?: number;
	}

	interface DOMEventPreview {
		kind: 'DOMEvent';
		type: string;
		properties: Object;
		target?: ObjectGrip;
	}

	interface ArrayLikePreview {
		kind: 'ArrayLike';
		length: number;
		items?: (Grip | null)[];
	}

	interface SafeGetterValuePreview {
		getterValue: Grip;
		getterPrototypeLevel: number;
		enumerable: boolean;
		writable: boolean;
	}

	interface ErrorPreview {
		kind: 'Error';
		name: string;
		message: string;
		fileName: string;
		lineNumber: number;
		columnNumber: number;
		stack: string;
	}

	interface FunctionGrip extends ObjectGrip {
		name?: string;
		displayName?: string;
		userDisplayName?: string;
		parameterNames?: string[];
		location?: {
			url: string;
			line?: number;
			column?: number;
		};
	}

	interface LongStringGrip extends ComplexGrip {
		type: 'longString';
		initial: string;
		length: number;
		actor: string;
	}

	interface SymbolGrip extends ComplexGrip {
		type: 'symbol';
		name: string;
	}

	interface BigIntGrip extends ComplexGrip {
		type: 'BigInt';
		text: string;
	}
}
