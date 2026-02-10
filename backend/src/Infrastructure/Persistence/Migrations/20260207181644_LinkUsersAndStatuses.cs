using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class LinkUsersAndStatuses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_components_categories_id",
                table: "components");

            migrationBuilder.AddColumn<Guid>(
                name: "role_id1",
                table: "users",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "status_id",
                table: "needs",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<string>(
                name: "photo_url",
                table: "categories",
                type: "varchar(500)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "categories",
                type: "varchar(2000)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "card_color",
                table: "categories",
                type: "varchar(50)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "created_by",
                table: "categories",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "ix_users_role_id1",
                table: "users",
                column: "role_id1");

            migrationBuilder.CreateIndex(
                name: "ix_needs_status_id",
                table: "needs",
                column: "status_id");

            migrationBuilder.AddForeignKey(
                name: "fk_history_users_id",
                table: "history",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_needs_status_id",
                table: "needs",
                column: "status_id",
                principalTable: "need_statuses",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_users_roles_role_id1",
                table: "users",
                column: "role_id1",
                principalTable: "roles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_wishlists_users_requested_by",
                table: "wishlists",
                column: "requested_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_history_users_id",
                table: "history");

            migrationBuilder.DropForeignKey(
                name: "fk_needs_status_id",
                table: "needs");

            migrationBuilder.DropForeignKey(
                name: "fk_users_roles_role_id1",
                table: "users");

            migrationBuilder.DropForeignKey(
                name: "fk_wishlists_users_requested_by",
                table: "wishlists");

            migrationBuilder.DropIndex(
                name: "ix_users_role_id1",
                table: "users");

            migrationBuilder.DropIndex(
                name: "ix_needs_status_id",
                table: "needs");

            migrationBuilder.DropColumn(
                name: "role_id1",
                table: "users");

            migrationBuilder.DropColumn(
                name: "status_id",
                table: "needs");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "categories");

            migrationBuilder.AlterColumn<string>(
                name: "photo_url",
                table: "categories",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "categories",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(2000)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "card_color",
                table: "categories",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "fk_components_categories_id",
                table: "components",
                column: "category_id",
                principalTable: "categories",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
