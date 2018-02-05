package com.tabner.DAOImpl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.tabner.entities.EmployeeInvoices;

@Component
public class InvoicesDAOImpl {
	
	@Autowired
	private JdbcTemplate  jdbcTemplate;

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}
	

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	
	
	public List <EmployeeInvoices> getTabnerInvoices(){
		
		String query = "select * from  emp_invoices ";
		
		return jdbcTemplate.query(query, new TabnerInvoiceMapper());
		
	}
	
	public static final class  TabnerInvoiceMapper implements RowMapper<EmployeeInvoices>{

		@Override
		public EmployeeInvoices mapRow(ResultSet rs, int rowNum) throws SQLException {
			
			EmployeeInvoices employeeInvoices = new EmployeeInvoices();
			employeeInvoices.setInv_id(rs.getInt(1));
			employeeInvoices.setEmp_id(rs.getString(2));
			employeeInvoices.setEmp_name(rs.getString(3));
			employeeInvoices.setVendor_id(rs.getString(4));
			employeeInvoices.setVendor_name(rs.getString(5));
			employeeInvoices.setHours(rs.getDouble(6));
			employeeInvoices.setAmount(rs.getDouble(7));
			employeeInvoices.setStart_date(rs.getString(8));
			employeeInvoices.setEnd_date(rs.getString(9));
			
			return employeeInvoices; 
		}
		
	}
	
public boolean createEmployeeInvoices(int inv_id,String emp_id,String emp_name,String vendor_id,String vendor_name,
			double hours,double amount,String start_date,String end_date) {
				
				String queryCheck = "select count(*) from emp_invoices where emp_name = ?";
				Integer i = jdbcTemplate.queryForObject(queryCheck, new Object[] { emp_name }, Integer.class);
				
				if (i > 0) {
					return false;
				} else {
					String query = "insert into emp_invoices values (?, ?, ?, ?, ?, ?)";
					jdbcTemplate.update(query,
							new Object[] { inv_id,emp_id,emp_name,vendor_id,vendor_name,hours,amount,start_date,end_date });
					return true; 
				}
			} 

}
