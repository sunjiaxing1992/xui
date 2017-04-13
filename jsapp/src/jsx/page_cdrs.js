/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2015-2017, Seven Du <dujinfang@x-y-t.cn>
 *
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is XUI - GUI for FreeSWITCH
 *
 * The Initial Developer of the Original Code is
 * Seven Du <dujinfang@x-y-t.cn>
 * Portions created by the Initial Developer are Copyright (C)
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Seven Du <dujinfang@x-y-t.cn>
 *
 *
 */

'use strict';

import React from 'react';
import T from 'i18n-react';
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { EditControl, xFetchJSON } from './libs/xtools';

class CDRPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {cdr: {}, edit: false};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
	}

	componentDidMount() {
		var _this = this;
		xFetchJSON("/api/cdrs/" + _this.props.params.uuid, "").then((data) => {
			console.log("cdr", data);
			_this.setState({cdr: data});
		}).catch((e) => {
			console.error("get cdr", e);
			notify('[' + e.status + '] ' + e.statusText);
		});
	}

	render() {
		const cdr = this.state.cdr;

		return <div>
			<h1><T.span text="CDR"/> <small>{cdr.uuid}</small></h1>
			<hr/>

			<Form horizontal id="CDRForm">
				<input type="hidden" name="id" defaultValue={cdr.id}/>
				<FormGroup controlId="formCaller_id_name">
					<Col componentClass={ControlLabel} sm={2}><T.span text="CID Name"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="caller_id_name" defaultValue={cdr.caller_id_name}/></Col>
				</FormGroup>

				<FormGroup controlId="formCaller_id_number">
					<Col componentClass={ControlLabel} sm={2}><T.span text="CID Number"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="caller_id_number" defaultValue={cdr.caller_id_number}/></Col>
				</FormGroup>

				<FormGroup controlId="formDestination_number">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Dest Number"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="destination_number" defaultValue={cdr.destination_number}/></Col>
				</FormGroup>

				<FormGroup controlId="formContext">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Context"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="context" defaultValue={cdr.context}/></Col>
				</FormGroup>

				<FormGroup controlId="formStart_stamp">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Start" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="start_stamp" defaultValue={cdr.start_stamp}/></Col>
				</FormGroup>

				<FormGroup controlId="formAnswer_stamp">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Answer"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="answer_stamp" defaultValue={cdr.answer_stamp}/></Col>
				</FormGroup>

				<FormGroup controlId="formEnd_stamp">
					<Col componentClass={ControlLabel} sm={2}><T.span text="End" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="end_stamp" defaultValue={cdr.end_stamp}/></Col>
				</FormGroup>

				<FormGroup controlId="formDuration">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Duration" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="duration" defaultValue={cdr.duration}/></Col>
				</FormGroup>

				<FormGroup controlId="formBillsec">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Bill Sec" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="billsec" defaultValue={cdr.billsec}/></Col>
				</FormGroup>

				<FormGroup controlId="formHangup_cause">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Cause" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="hangup_cause" defaultValue={cdr.hangup_cause}/></Col>
				</FormGroup>

				<FormGroup controlId="formAccount_code">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Account Code" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="account_code" defaultValue={cdr.account_code}/></Col>
				</FormGroup>
			</Form>
		</div>
	}
}

class CDRsPage extends React.Component {
	constructor(props) {
		super(props);
		var theRows = localStorage.getItem("theRows");
    	if (theRows == null) {
	    	var r = 10000;
	    	localStorage.setItem("theRows", r);
     	}
		this.state = {
			rows: [],
			loaded: false,
			hiddendiv: 'none',
			curPage: 1,
			rowCount: 0,
			pageCount: 0
		};

		this.handleQuery = this.handleQuery.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleMore = this.handleMore.bind(this);
		this.handlePageTurn = this.handlePageTurn.bind(this);
	}

	handleClick (x) {
	}

	handleControlClick (e) {
		console.log("clicked", e.target);
	}

	handleMore (e) {
		e.preventDefault();
		this.setState({hiddendiv: this.state.hiddendiv == 'none' ? 'block' : 'none'});
	}

	handleSearch (e) {
		const qs = "startDate=" + this.startDate.value +
			"&endDate=" + this.endDate.value +
			"&cidNumber=" + this.cidNumber.value +
			"&destNumber=" + this.destNumber.value;
		console.log(qs);

		xFetchJSON("/api/cdrs?" + qs).then((cdrs) => {
			this.setState({
				rows: cdrs.data,
				pageCount: cdrs.pageCount, 
				rowCount: cdrs.rowCount,
				curPage: cdrs.curPage
			});
		});
	}

	handlePageTurn (e, pageNum) {
		var qs = "";

		e.preventDefault();
		if (pageNum < 0) return; // do nothing

		if (this.state.hiddendiv == "block") {
			qs = "startDate=" + this.startDate.value +
				"&endDate=" + this.endDate.value +
				"&cidNumber=" + this.cidNumber.value +
				"&destNumber=" + this.destNumber.value;
		} else {
			qs = "last=" + this.days;
		}

		qs = qs + "&pageNum=" + pageNum;

		xFetchJSON("/api/cdrs?" + qs).then((cdrs) => {
			this.setState({
				rows: cdrs.data,
				pageCount: cdrs.pageCount, 
				rowCount: cdrs.rowCount,
				curPage: cdrs.curPage
			});
		});
	}

	componentWillMount () {
	}

	componentWillUnmount () {
	}

	componentDidMount () {
		xFetchJSON("/api/cdrs").then((cdrs) => {
			this.setState({
				rows: cdrs.data,
				pageCount: cdrs.pageCount, 
				rowCount: cdrs.rowCount,
				curPage: cdrs.curPage,
				loaded : true
			});
		});
	}

	handleQuery (e) {
		var data = parseInt(e.target.getAttribute("data"));

		this.days = data;
		e.preventDefault();

		xFetchJSON("/api/cdrs?last=" + data).then((cdrs) => {
			this.setState({
				rows: cdrs.data,
				pageCount: cdrs.pageCount, 
				rowCount: cdrs.rowCount,
				curPage: cdrs.curPage
			});
		});
	}

	render () {
		var _this = this;
		let isShow;

		var rows = this.state.rows.map(function(row) {
			return <tr key={row.uuid}>
				<td>{row.caller_id_name}</td>
				<td>{row.caller_id_number}</td>
				<td>{row.destination_number}</td>
				<td>{row.context}</td>
				<td>{row.start_stamp}</td>
				<td>{row.answer_stamp}</td>
				<td>{row.end_stamp}</td>
				<td>{row.duration}</td>
				<td>{row.billsec}</td>
				<td>{row.hangup_cause}</td>
				<td>{row.account_code}</td>
				<td><Link to={`/cdrs/${row.uuid}`}><T.span text="Detail"/></Link></td>
			</tr>
		})

		var pagination = function() {
			var pageCount = _this.state.pageCount;
			var curPage = _this.state.curPage;
			var rePages = [];
			var paginationInfos = [];
			var len = 7; // hard code temporary
			var pageStart = 1;

			if (pageCount == 0) return <div/>

			if (pageCount <= len) {
				len = pageCount;
			} else {
				if (curPage > Math.ceil(len/2)) {
					if (curPage >= (pageCount - Math.floor(len/2))) {
						pageStart = pageCount - len + 1;
					} else {
						pageStart = curPage - Math.floor(len/2);
					}
				}
			}

			for (var j = 1, i = pageStart; j <= len + 4; j ++) {
				var liClass = "";
				var paginationText = "";
				var redirectPage = -1;  // means do nothing
				var paginationInfo = {};

				if (j == 1) {
					paginationText = "First Page";

					if (curPage == 1) {
						liClass = "disabled";
					} else {
						redirectPage = 1;
					}
				} else if (j == 2) {
					paginationText = "Previous Page";

					if (curPage == 1) {
						liClass = "disabled";
					} else {
						redirectPage = curPage - 1;
					}
				} else if (j == len + 3) {
					paginationText = "Next Page";

					if (curPage == pageCount) {
						liClass = "disabled";
					} else {
						redirectPage = curPage + 1;
					}
				} else if (j == len + 4) {
					paginationText = "Last Page";

					if (curPage == pageCount) {
						liClass = "disabled";
					} else {
						redirectPage = 0;
					}
				} else {
					if (i == curPage) {
						liClass = "active";
						redirectPage = -1;
					} else {
						redirectPage = i;
					}

					paginationText = i.toString();
					i ++;
				}

				paginationInfo.paginationText = paginationText;
				paginationInfo.redirectPage = redirectPage;
				paginationInfo.liClass = liClass;

				paginationInfos.push(paginationInfo);
			}

			var paginationSelectItems = paginationInfos.map(function(info) {
				return( 
					<ul className="pagination">
						<li className={info.liClass}>
							<T.a text={info.paginationText} onClick={(e) => _this.handlePageTurn(e, info.redirectPage)} href="#"/>
						</li>
					</ul>
				);
			});

			return(
				<nav className="pull-right">
					{paginationSelectItems}
				</nav>
			)
		}();

		if(this.state.loaded){
			isShow = "none";
		}

		const loadSpinner = {
			width : "200px",
			height : "200px",
			margin : "auto", 
			clear : "both",
			display : "block",
			color : 'gray',
			display : isShow
		}

		var now = new Date();
		var nowdate = Date.parse(now);
		var sevenDaysBeforenowtime = nowdate - 7*24*60*60*1000;
		var sevenDaysBeforenowdate = new Date(sevenDaysBeforenowtime);

		function getTime(time){
			var month = (time.getMonth() + 1);
			var day = time.getDate();
			if (month < 10) 
				month = "0" + month;
			if (day < 10)
				day = "0" + day;
			return time.getFullYear() + '-' + month + '-' + day;
		}

		var today = getTime(now);
		var sevenDaysBeforeToday = getTime(sevenDaysBeforenowdate);

		return <div>
			<ButtonToolbar className="pull-right">
				<T.span text="Last"/> &nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", day: 7}} data="7" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", day: 15}} data="15" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", day: 30}} data="30" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", day: 60}} data="60" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", day: 90}} data="90" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleMore} text="More" data="more" href="#"/>...
				<br/>
				<div className="pull-right">
					<T.span text="Total Rows"/>: {this.state.rowCount} &nbsp;&nbsp;
					<T.span text="Current Page/Total Page"/>: {this.state.curPage}/{this.state.pageCount}
				</div>
			</ButtonToolbar>

			<h1><T.span text="CDRs"/></h1>
			<div>
				<div style={{padding: "5px", display: _this.state.hiddendiv}} className="pull-right">
					<input type="date" defaultValue={sevenDaysBeforeToday} ref={(input) => { _this.startDate = input; }}/> -&nbsp;
					<input type="date" defaultValue={today} ref={(input) => { _this.endDate = input; }}/> &nbsp;
					<T.span text="CID Number"/><input ref={(input) => { _this.cidNumber = input; }}/> &nbsp;
					<T.span text="Dest Number"/><input ref={(input) => { _this.destNumber = input; }}/> &nbsp;
					<T.button text="Search" onClick={this.handleSearch}/>
				</div>

				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="CID Name"/></th>
					<th><T.span text="CID Number"/></th>
					<th><T.span text="Dest Number"/></th>
					<th><T.span text="Context"/></th>
					<th><T.span text="Start"/></th>
					<th><T.span text="Answer"/></th>
					<th><T.span text="End"/></th>
					<th><T.span text="Duration"/></th>
					<th><T.span text="Bill Sec"/></th>
					<th><T.span text="Cause"/></th>
					<th><T.span text="Account Code"/></th>
					<th><T.span text="Detail"/></th>
				</tr>
				{rows}
				<tr>
					<td colSpan="12">
						{pagination}
					</td>
				</tr>
				</tbody>
				</table>
			</div>
			<div style={{textAlign: "center"}}>
				<img style={loadSpinner} src="assets/img/loading.gif"/>
			</div>
		</div>
	}
};

export {CDRPage, CDRsPage};
