package com.testmocker.service;

import com.testmocker.httpmodel.MailItem;

public interface MailWebService {
	void sendMail(MailItem mailItem);
}
