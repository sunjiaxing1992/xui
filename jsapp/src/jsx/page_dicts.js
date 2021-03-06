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
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Radio, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek'
import { EditControl, xFetchJSON } from './libs/xtools'

class NewDict extends React.Component {
	constructor(props) {
		super(props);

		this.last_id = 0;
		this.state = {errmsg: ''};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var dt = form2json('#newDictForm');
		console.log("dt", dt);

		if (!dt.realm || !dt.k) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}
		xFetchJSON("/api/dicts", {
			method: "POST",
			body: JSON.stringify(dt)
		}).then((obj) => {
			dt.id = obj.id;
			_this.props.handleNewDictAdded(dt);
		}).catch((msg) => {
			console.error("dict", msg);
			_this.setState({errmsg: msg});
		});
	}

	render() {
		const props = Object.assign({}, this.props);
		delete props.handleNewDictAdded;

		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New Dict" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form horizontal id="newDictForm">
				<FormGroup controlId="formRealm">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Realm" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="realm" placeholder="realm1" /></Col>
				</FormGroup>

				<FormGroup controlId="formKey">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Key" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="k" placeholder="key" /></Col>
				</FormGroup>

				<FormGroup controlId="formValue">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Value"/></Col>
					<Col sm={10}><FormControl type="input" name="v" placeholder="value" /></Col>
				</FormGroup>

				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description"/></Col>
					<Col sm={10}><FormControl type="input" name="d" placeholder="description" /></Col>
				</FormGroup>

				<FormGroup controlId="formOrder">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Order"/></Col>
					<Col sm={10}><FormControl type="input" name="o" defaultValue="0" /></Col>
				</FormGroup>


				<FormGroup>
					<Col smOffset={2} sm={10}>
						<Button type="button" bsStyle="primary" onClick={this.handleSubmit}>
							<i className="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;
							<T.span text="Save" />
						</Button>
						&nbsp;&nbsp;<T.span className="danger" text={this.state.errmsg}/>
					</Col>
				</FormGroup>
			</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={this.props.onHide}>
					<i className="fa fa-times" aria-hidden="true"></i>&nbsp;
					<T.span text="Close" />
				</Button>
			</Modal.Footer>
		</Modal>;
	}
}

class DictPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {errmsg: '', dt: {}, edit: false};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleControlClick = this.handleControlClick.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var dt = form2json('#newDictForm');
		console.log("dt", dt);

		if (!dt.realm || !dt.k) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		xFetchJSON("/api/dicts/" + dt.id, {
			method: "PUT",
			body: JSON.stringify(dt)
		}).then((data) => {
			_this.setState({dt: dt, errmsg: {key: "Saved at", time: Date()}})
		}).catch((msg) => {
			console.error("dict", msg);
		});
	}

	handleControlClick(e) {
		this.setState({edit: !this.state.edit});
	}

	componentDidMount() {
		var _this = this;
		xFetchJSON("/api/dicts/" + this.props.params.id).then((data) => {
			console.log("dt", data);
			_this.setState({dt: data});
		}).catch((msg) => {
			console.log("get dt ERR");
		});
	}

	render() {
		const dt = this.state.dt;
		let save_btn = "";
		let err_msg = "";
		let register = dt.register == "true" ? "Yes" : "No";

		if (this.state.edit) {
			save_btn = <Button onClick={this.handleSubmit}><i className="fa fa-save" aria-hidden="true"></i>&nbsp;<T.span text="Save"/></Button>

			if (dt.register == "true") {
				register = <span>
					<Radio name="register" value="true" inline defaultChecked>Yes</Radio>
					<Radio name="register" value="false" inline>No</Radio>
				</span>
			} else {
				register = <span>
					<Radio name="register" value="true" inline>Yes</Radio>
					<Radio name="register" value="false" inline defaultChecked>No</Radio>
				</span>
			}

			if (this.state.errmsg) {
				err_msg  = <Button><T.span text={this.state.errmsg} className="danger"/></Button>
			}
		}

		return <div>
			<ButtonToolbar className="pull-right" onClick={this.handleControlClick}>
			<ButtonGroup>
				{err_msg} { save_btn }
				<Button onClick={this.handleControlClick}><i className="fa fa-edit" aria-hidden="true"></i>&nbsp;<T.span text="Edit"/></Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h1>{dt.realm} <small>{dt.k}</small></h1>
			<hr/>

			<Form horizontal id="newDictForm">
				<input type="hidden" name="id" defaultValue={dt.id}/>
				<FormGroup controlId="formRealm">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Realm" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="realm" defaultValue={dt.realm}/></Col>
				</FormGroup>

				<FormGroup controlId="formKey">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Key" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="k" defaultValue={dt.k}/></Col>
				</FormGroup>

				<FormGroup controlId="formValue">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Value"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="v" defaultValue={dt.v}/></Col>
				</FormGroup>

				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="d" defaultValue={dt.d}/></Col>
				</FormGroup>

				<FormGroup controlId="formOrder">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Order"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="o" defaultValue={dt.o}/></Col>
				</FormGroup>

				<FormGroup controlId="formSave">
					<Col componentClass={ControlLabel} sm={2}></Col>
					<Col sm={10}>{save_btn}</Col>
				</FormGroup>
			</Form>
		</div>
	}
}

class DictsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { formShow: false, rows: [], danger: false};

		// This binding is necessary to make `this` work in the callback
		this.handleControlClick = this.handleControlClick.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.toggleHighlight = this.toggleHighlight.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSortClick = this.handleSortClick.bind(this);
	}

	handleControlClick(data) {
		console.log("data", data);

		if (data == "new") {
			this.setState({ formShow: true});
		}
	}

	handleDelete(id) {
		console.log("deleting id", id);
		var _this = this;

		if (!this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));

			if (!c) return;
		}

		xFetchJSON("/api/dicts/" + id, {
			method: "DELETE"
		}).then((obj) => {
			console.log("deleted")
			var rows = _this.state.rows.filter(function(row) {
				return row.id != id;
			});

			_this.setState({rows: rows});
		}).catch((msg) => {
				console.error("route", msg);
		});
	}

	handleSortClick(field) {
		var rows = this.state.rows;

		var n = 1;

		if (this.state.order == 'ASC') {
			this.state.order = 'DSC';
			n = -1;
		} else {
			this.state.order = 'ASC';
		}

		rows.sort(function(a,b) {
			return a[field] < b[field] ? -1 * n : 1 * n;
		});

		this.setState({rows: rows});
	}

	componentDidMount() {
		var _this = this;

		var realm = this.props.location.query.realm;
		let url = "/api/dicts";

		if (realm) url = url + "?realm=" + realm;

		xFetchJSON(url).then((data) => {
			console.log("dt", data)
			_this.setState({rows: data});
		}).catch((msg) => {
			console.log("get dicts ERR");
		});
	}

	handleRealmClick(realm) {
		const _this = this;
		console.log("realm clicked", realm);

		console.log(realm);
		let url = "/api/dicts";

		if (realm) url = url + "?realm=" + realm;

		xFetchJSON(url).then((data) => {
			console.log("dt", data)
			_this.setState({rows: data})
		}).catch((msg) => {
			console.log("get dicts ERR");
		});
	}

	handleDictAdded(route) {
		var rows = this.state.rows;
		rows.unshift(route);
		this.setState({rows: rows, formShow: false});
	}

	toggleHighlight() {
		this.setState({highlight: !this.state.highlight});
	}

	handleChange(obj) {
		const _this = this;
		const id = parseInt(Object.keys(obj)[0]);
		const value = Object.values(obj)[0];

		var rows = _this.state.rows;
		var ro = {};

		rows.map(function(row) {
			if(row.id == id){
				ro.id = row.id;
				ro.realm = row.realm;
				ro.k = row.k;
				ro.v = value;
				ro.d = row.d;
				ro.o = row.o;
			}
		});
		var resrows = [];
		xFetchJSON("/api/dicts/" + id , {
			method: "PUT",
			body: JSON.stringify(ro)
		}).then((data) => {
			_this.state.rows.map(function(r){
			console.log(id+'--'+r.id);
				if (r.id == id) {
					r = ro;
				}			
				resrows.push(r);	
			})
			console.log(resrows)
			_this.setState({rows: resrows});
		}).catch((msg) => {
			console.error("failed", msg);
		});
	}

	isStringAcceptable() {
		return true;
	}

	render() {
		const row = this.state.rows;
		let formClose = () => this.setState({ formShow: false });
		let toggleDanger = () => this.setState({ danger: !this.state.danger });
		let hand = { cursor: "pointer" };
	    var danger = this.state.danger ? "danger" : "";

		var _this = this;

		var rows = this.state.rows.map(function(row) {
			var id = (row.id).toString();
			return <tr key={row.id}>
					<td>{row.id}</td>
					<td><Link to={`/settings/dicts?realm=${row.realm}`} onClick={() => _this.handleRealmClick(row.realm)}>{row.realm}</Link></td>
					<td><Link to={`/settings/dicts/${row.id}`}>{row.k}</Link></td>
					<td >
						<RIEInput value={_this.state.highlight ? (row.v ? row.v : T.translate("Click to Change")) : row.v} 
						change={_this.handleChange}
						propName={id}
						className={_this.state.highlight ? "editable" : ""}
						validate={_this.isStringAcceptable}
						classLoading="loading"
						classInvalid="invalid"/>
					</td>
					<td>{row.d}</td>
					<td>{row.o}</td>
					<td><T.a onClick={() => _this.handleDelete(row.id)} text="Delete" className={danger} style={{cursor:"pointer"}}/></td>
			</tr>;
		})

		return <div>
			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				<Button onClick={() => this.handleControlClick("new")}>
					<i className="fa fa-plus" aria-hidden="true" onClick={() => this.handleControlClick("new")}></i>&nbsp;
					<T.span onClick={() => this.handleControlClick("new")} text="New" />
				</Button>
			</ButtonGroup>

			<ButtonGroup>
				<Button onClick={this.toggleHighlight}>
					<i className="fa fa-edit" aria-hidden="true"></i>&nbsp;
					<T.span onClick={this.toggleHighlight} text="Edit" />
				</Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h1><T.span text="Dicts"/></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span style={hand} text="Realm" onClick={() => this.handleSortClick("realm")}/></th>
					<th><T.span style={hand} text="Key" onClick={() => this.handleSortClick("k")}/></th>
					<th><T.span text="Value"/></th>
					<th><T.span text="Description"/></th>
					<th><T.span style={hand} text="Order" onClick={() => this.handleSortClick("o")}/></th>
					<th><T.span style={hand} text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>

			<NewDict show={this.state.formShow} onHide={formClose} handleNewDictAdded={this.handleDictAdded.bind(this)}/>
		</div>
	}
}

export {DictsPage, DictPage};
