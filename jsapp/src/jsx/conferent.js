/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2015-2016, Seven Du <dujinfang@x-y-t.cn>
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
 * blocks.jsx - Blocks Page
 *
 */

'use strict';

import React from 'react';
import T from 'i18n-react';
import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';
import RomesPage from "./page_romes";
import { LinkContainer } from 'react-router-bootstrap';

class Conferent extends React.Component {
	render() {
		return <Nav bsStyle="pills" stacked>
			<LinkContainer to="/conferent/romes" key="M_ROMES">
				<NavItem eventKey="M_ROME"><T.span text="Romes"/></NavItem>
			</LinkContainer>
		</Nav>
	}
}

export default Conferent;