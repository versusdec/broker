import { applyPagination } from '../../utils/apply-pagination';
// import { applySort } from '../../utils/apply-sort';
// import { deepCopy } from '../utils/deep-copy';
import { customer, customers, emails, invoices, logs } from './data';

class CustomersApi {
  getCustomers(request = {}) {
    const { filters, page, rowsPerPage, sortBy, sortDir } = request;

    let data = customers;
    let count = data.length;

    if (typeof filters !== 'undefined') {
      data = data.filter((customer) => {
        if (typeof filters.query !== 'undefined' && filters.query !== '') {
          let queryMatched = false;
          const properties = ['email', 'name'];

          properties.forEach((property) => {
            if ((customer[property]).toLowerCase().includes(filters.query.toLowerCase())) {
              queryMatched = true;
            }
          });

          if (!queryMatched) {
            return false;
          }
        }

        if (typeof filters.hasAcceptedMarketing !== 'undefined') {
          if (customer.hasAcceptedMarketing !== filters.hasAcceptedMarketing) {
            return false;
          }
        }

        if (typeof filters.isProspect !== 'undefined') {
          if (customer.isProspect !== filters.isProspect) {
            return false;
          }
        }

        if (typeof filters.isReturning !== 'undefined') {
          if (customer.isReturning !== filters.isReturning) {
            return false;
          }
        }

        return true;
      });
      count = data.length;
    }

    if (typeof page !== 'undefined' && typeof rowsPerPage !== 'undefined') {
      data = applyPagination(data, page, rowsPerPage);
    }

    return Promise.resolve({
      data,
      count
    });
  }

  getCustomer(request) {
    return Promise.resolve(customer);
  }

  getEmails(request) {
    return Promise.resolve(emails);
  }

  getInvoices(request) {
    return Promise.resolve(invoices);
  }

  getLogs(request) {
    return Promise.resolve(logs);
  }
}

export const customersApi = new CustomersApi();
