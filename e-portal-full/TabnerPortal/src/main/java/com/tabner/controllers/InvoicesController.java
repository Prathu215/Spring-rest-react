package com.tabner.controllers;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.tabner.DAOImpl.InvoicesDAOImpl;
import com.tabner.entities.EmployeeInvoices;
import com.tabner.entities.Response;
import com.tabner.metadata.UserValidator;

@RestController
public class InvoicesController {
	
	@Autowired
	private InvoicesDAOImpl invoicesDAOImpl;
	
	@Autowired
	private UserValidator  userValidator;
	
	@RequestMapping(value = "/tabnerinvoices", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<Response> getTabnerInvoices(HttpServletRequest req){
		
		Response response = new Response();
		String token = req.getHeader("tabner_token");
		boolean isValidatedToken = userValidator.validateToken(token);
		if(isValidatedToken)
		{
			List<EmployeeInvoices> list = invoicesDAOImpl.getTabnerInvoices();
			response.setResponse(list);
			
		}
		else {
			
			response.setResponse("No Token Available");
		}
		return new ResponseEntity<Response>(response, HttpStatus.OK); 
		
		
	}
	
	
	

}
