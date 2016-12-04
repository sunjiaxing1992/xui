require 'xdb'
xdb.bind(xtra.dbh)

m_sip_profile = {}

function create(kvp)
	template = kvp.template
	kvp.template = nil

	id = xdb.create_return_id("sip_profiles", kvp)
	-- print(id)
	if id then
		local realm = 'SOFIA'
		local ref_id = 0
		if not (template == "default") then
			realm = 'sip_profile' -- the table name
			ref_id = template
		end

		local sql = "INSERT INTO params (realm, k, v, ref_id, disabled) SELECT 'sip_profile', k, v, " ..
			id .. ", disabled From params WHERE " ..
			xdb.cond({realm = realm, ref_id = ref_id})

		xdb.execute(sql)
	end
	return id
end

function params(profile_id)
	rows = {}
	sql = "SELECT * from params WHERE realm = 'sip_profile' AND ref_id = " .. profile_id
	print(sql)
	xdb.find_by_sql(sql, function(row)
		table.insert(rows, row)
	end)
	-- print(serialize(rows))
	return rows
end

function toggle_param(profile_id, param_id)
	sql = "UPDATE params SET disabled = NOT disabled" ..
		" WHERE " .. xdb.cond({realm = 'sip_profile', ref_id = profile_id, id = param_id})
	print(sql)
	xdb.execute(sql)
	if xdb.affected_rows() == 1 then
		return xdb.find("params", param_id)
	end
	return nil
end

function update_param(profile_id, param_id, kvp)
	xdb.update("params", {realm = 'sip_profile', ref_id = profile_id, id = param_id}, kvp)
	if xdb.affected_rows() == 1 then
		return xdb.find("params", param_id)
	end
	return nil;
end

m_sip_profile.delete = function(profile_id)
	xdb.delete("sip_profiles", profile_id);
	if (xdb.affected_rows() == 1) then
		local sql = "DELETE FROM params WHERE " .. xdb.cond({realm = 'sip_profile', ref_id = profile_id})
		xdb.execute(sql)
	end
	return xdb.affected_rows()
end

m_sip_profile.create = create
m_sip_profile.params = params
m_sip_profile.toggle_param = toggle_param
m_sip_profile.update_param = update_param

