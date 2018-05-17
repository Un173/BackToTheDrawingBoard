using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackToTheDrawingBoard.Models;

namespace BackToTheDrawingBoard.Controllers
{
    [Produces("application/json")]
    [Route("api/LoginTables")]
    public class LoginTablesController : Controller
    {
        private readonly myDBContext _context;

        public LoginTablesController(myDBContext context)
        {
            _context = context;
        }

        // GET: api/LoginTables
        [HttpGet]
        public IEnumerable<LoginTable> GetLoginTable()
        {
            return _context.LoginTable;
        }

        // GET: api/LoginTables/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoginTable([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loginTable = await _context.LoginTable.SingleOrDefaultAsync(m => m.Id == id);

            if (loginTable == null)
            {
                return NotFound();
            }

            return Ok(loginTable);
        }

        // PUT: api/LoginTables/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoginTable([FromRoute] int id, [FromBody] LoginTable loginTable)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != loginTable.Id)
            {
                return BadRequest();
            }

            _context.Entry(loginTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoginTableExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/LoginTables
        [HttpPost]
        public async Task<IActionResult> PostLoginTable([FromBody] LoginTable loginTable)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.LoginTable.Add(loginTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoginTable", new { id = loginTable.Id }, loginTable);
        }

        // DELETE: api/LoginTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoginTable([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loginTable = await _context.LoginTable.SingleOrDefaultAsync(m => m.Id == id);
            if (loginTable == null)
            {
                return NotFound();
            }

            _context.LoginTable.Remove(loginTable);
            await _context.SaveChangesAsync();

            return Ok(loginTable);
        }

        private bool LoginTableExists(int id)
        {
            return _context.LoginTable.Any(e => e.Id == id);
        }
    }
}