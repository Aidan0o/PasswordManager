#include <iostream>
#include <vector>
#include "sqlite3.h"
 
using namespace std;

sqlite3* tempDB;   // prepare pointer to db 
sqlite3_stmt* stmt;  // prepare statement

// struct to hold a single password
struct Password {
    int id;
    string name;
    string password;
};

// function to set up a new database
void create_database() {
    // example table: 
    //  create table passwords (id integer primary key, name text, password text);
    // insert into passwords(name, password) values('aidan@gmail.com', 'hashedsecrethere');
};

// return all passwords
//vector<Password> get_passwords(string user) {}


// execute function
// FIXME: change return type if needed
int execute_sql(const char* sql) {
    return sqlite3_prepare_v2(tempDB, sql, -1, &stmt, nullptr);
}

int main() {

    int rc = sqlite3_open("passwords.db", &tempDB);   // open the passwords.db database / variable rc hold return code to check if successful or not
    if (rc != SQLITE_OK) {//if return code not =  0 - if there's errors
        cerr << "Cannot open database: " << sqlite3_errmsg(tempDB) << endl;
        return 1;
    }

    // Prepare statement using an example sql query.  
    rc = execute_sql("SELECT id, name, password FROM passwords;");
    if (rc != SQLITE_OK) { //if return code 0 - if no errors
        cerr << "Failed to prepare statement: " << sqlite3_errmsg(tempDB) << endl;
        sqlite3_close(tempDB);
        return 1;
    }

    // execute the statement and output results
    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);
        const unsigned char* name = sqlite3_column_text(stmt, 1);
        const unsigned char* password = sqlite3_column_text(stmt, 2);
        cout << "ID: " << id << ", Name: " << name << ", Pass: " << password << endl;
    }

    // close the connection to the db
    sqlite3_finalize(stmt);
    sqlite3_close(tempDB);
    return 0;
}