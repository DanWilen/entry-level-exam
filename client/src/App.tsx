import React from 'react';
import './App.scss';
import {createApiClient, GetTicketParams , Ticket} from './api';
import ShowContent from "./components/ticket-content"
import Rename from "./components/rename-button";

export type AppState = {
	tickets?: Ticket[],
	search: string,
	sortBy: keyof Ticket,
	ascending: Boolean,
	page: number,
	hasNext: boolean,
	numberOfResult: number
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		sortBy: 'title',
		ascending: false,
		page: 1,
		hasNext: true,
		numberOfResult: 1,
	}

	searchDebounce: any = null;

	async componentDidMount() {
		const {sortBy} = this.state;
		await this.getTickets(sortBy);
		}

	getTickets = async (sortBy:keyof Ticket) => {
		const {ascending, page, search} = this.state;
		const params: GetTicketParams = {
			sortBy: sortBy,
			ascending: ascending.toString(),
			page: page,
			searchBarInput: search.toLowerCase()
		}

		const t = await api.getTickets(params, page, search);
		this.setState({
			tickets: t.pageTickets,
			hasNext: t.hasNext,
			ascending: !ascending,
			sortBy: sortBy,
			page: page,
			search: search
		});
	}


	renderButton = (name: string, property: keyof Ticket) => {
		const {sortBy, ascending} = this.state;
		const orderArrow = sortBy === property ? ascending ? "⬆" : "⬇" : null;
		return (
			<button className='sort-btn' onClick={() => this.getTickets(property)}>{name} {orderArrow}</button>
		)
	}

	renderSortButtons = () => {
		return (
			<div>
				{this.renderButton('Sort by title', 'title')}
				{this.renderButton('Sort by date', 'creationTime')}
				{this.renderButton('Sort by Email', 'userEmail')}
			</div>
		)
	}

	/**
	 * Creates buttons for previous and next page, and present the current label.
	 */
	getPageNumber = () => {
		let prev = null;
		let curr: number = this.state.page;
		let next;
		const {hasNext, page} = this.state
		if (hasNext) {
			next = <button className='next-page' onClick={() => this.nextPage()}> &#9654; </button>
		}
		if (page > 1) {
			prev = <button className='previous-page' onClick={() => this.prevPage()}> &#9664; </button>
		}
		let currentPage: string = ' page: ' + curr.toString() + ' ';
		return (<div className='page-buttons'>{prev}{currentPage}{next}</div>)
	}

	/**
	 * Sets page's state to previous page.
	 */
	prevPage = async () => {
		console.log(this.getTickets.length)
		await this.setState({hasNext: true, page: this.state.page - 1})
		const {sortBy} = this.state
		await this.getTickets(sortBy)
	}

	/**
	 * Sets page's state to next page.
	 */
	nextPage = async () => {
		await this.setState({page:this.state.page + 1})
		const {sortBy} = this.state
		await this.getTickets(sortBy)
	}

	setSearchBarInput = async () => {
		await this.setState({search:this.state.search.toLowerCase()})
		const {sortBy} = this.state
		await this.getTickets(sortBy)
	}

	/**
	 * (My addition for ex.3), when clicking on a label,it shows all the tickets that contain this label in content.
	 */
	LabelFilter = async (label: string) => {
		await this.setState({search: label})
		const {sortBy} = this.state;
		await this.getTickets(sortBy);
	}

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
				<Rename id={ticket.id} title={ticket.title}></Rename>
				<ShowContent content={ticket.content}></ShowContent>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					<div className='labels'>{ticket.labels? ticket.labels.map((labels)=>
						(<button key={labels} className ='label' onClick={() => this.LabelFilter(labels)} >{labels}</button>))  : null }</div>
				</footer>
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val,
				page: 1
			});
			await this.setSearchBarInput()
		}, 300);
	}

	render() {	
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<div> {this.getPageNumber()} </div> <br/>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value, this.state.page)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results </div> : null }
			{this.renderSortButtons()} <br/>
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}

		</main>)
	}
}

export default App;